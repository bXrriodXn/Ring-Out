
class GameScene extends Phaser.Scene {

    constructor() {
        super('GameScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#172638');

        // Título y botón de regreso
        this.add.text(480, 55, 'ARENA DE ENTRENAMIENTO', {
            fontFamily: 'Arial',
            fontSize: '28px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const back = this.add.text(25, 20, 'VOLVER AL MENU', {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#aaccdd'
        }).setInteractive({ useHandCursor: true });

        back.on('pointerover', () => back.setColor('#ffffff'));
        back.on('pointerout', () => back.setColor('#aaccdd'));
        back.on('pointerdown', () => this.scene.start('MenuScene'));

        // Plataforma principal
        const platform = this.add.rectangle(
            480, 445, 680, 24, 0x466478
        ).setStrokeStyle(2, 0x80c9eb);

        // Convertirla en un cuerpo físico estático
        this.physics.add.existing(platform, true);
        platform.body.updateFromGameObject();

        // Solo permitir aterrizar sobre su cara superior
        platform.body.checkCollision.down = false;
        platform.body.checkCollision.left = false;
        platform.body.checkCollision.right = false;

        // Crear los personajes
        this.bolt = this.createRobot('bolt', 300, false);
        this.rivet = this.createRobot('rivet', 660, true);

        // Colisiones contra la plataforma
        this.physics.add.collider(this.bolt, platform);
        this.physics.add.collider(this.rivet, platform);

        // Recuperar controles configurados
        this.controls = loadGameSettings().controls;
        this.keysDown = new Set();

        const usedKeys = new Set([
            ...Object.values(this.controls.bolt),
            ...Object.values(this.controls.rivet)
        ]);

        // Detectar teclas pulsadas
        const onKeyDown = (event) => {
            if (!usedKeys.has(event.code)) return;

            event.preventDefault();
            this.keysDown.add(event.code);

            if (event.repeat) return;

            if (event.code === this.controls.bolt.jump) {
                this.jump(this.bolt, 'bolt');
            }

            if (event.code === this.controls.rivet.jump) {
                this.jump(this.rivet, 'rivet');
            }
        };

        // Detectar teclas soltadas
        const onKeyUp = (event) => {
            this.keysDown.delete(event.code);

            if (usedKeys.has(event.code)) {
                event.preventDefault();
            }
        };

        this.input.keyboard.on('keydown', onKeyDown);
        this.input.keyboard.on('keyup', onKeyUp);

        // Limpiar eventos al abandonar la escena
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.input.keyboard.off('keydown', onKeyDown);
            this.input.keyboard.off('keyup', onKeyUp);
            this.keysDown.clear();
        });

        // Información provisional
        this.add.text(480, 505,
            'BOLT: A / D / W       RIVET: Flechas',
            {
                fontFamily: 'Arial',
                fontSize: '17px',
                color: '#aaccdd'
            }
        ).setOrigin(0.5);
    }

    createRobot(name, x, flip) {
        const robot = this.physics.add.sprite(x, 350, name, 0);

        robot.setScale(2);
        robot.setFlipX(flip);
        robot.setCollideWorldBounds(false);

        // Caja física ajustada al cuerpo del robot
        robot.body.setSize(34, 56, false);
        robot.body.setOffset(15, 7);

        robot.play(`${name}-idle`);

        return robot;
    }

    jump(robot, name) {
        const grounded =
            robot.body.blocked.down || robot.body.touching.down;

        if (!grounded) return;

        robot.setVelocityY(-480);
        robot.play(`${name}-jump`);
    }

    update() {
        this.updateRobot(this.bolt, 'bolt', 300);
        this.updateRobot(this.rivet, 'rivet', 660);
    }

    updateRobot(robot, name, spawnX) {
        const controls = this.controls[name];

        const left = this.keysDown.has(controls.left);
        const right = this.keysDown.has(controls.right);

        // -1 izquierda, 0 parado, 1 derecha
        const direction = Number(right) - Number(left);

        robot.setVelocityX(direction * 230);

        // Orientación visual
        if (direction !== 0) {
            robot.setFlipX(direction < 0);
        }

        const grounded =
            (robot.body.blocked.down || robot.body.touching.down) &&
            robot.body.velocity.y >= 0;

        // Elegir animación según el movimiento
        let animation;

        if (!grounded) {
            animation = `${name}-jump`;
        } else if (direction !== 0) {
            animation = `${name}-walk`;
        } else {
            animation = `${name}-idle`;
        }

        if (robot.anims.currentAnim?.key !== animation) {
            robot.play(animation);
        }

        // Reaparición provisional si cae de la arena
        if (robot.y > 620) {
            robot.body.reset(spawnX, 350);
            robot.play(`${name}-idle`);
        }
    }
}
