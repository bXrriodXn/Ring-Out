

class GameScene extends Phaser.Scene {

    constructor() {
        super('GameScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#172638');

        // Título
        this.add.text(480, 55, 'ARENA DE ENTRENAMIENTO', {
            fontFamily: 'Arial',
            fontSize: '28px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Volver al menú
        const back = this.add.text(25, 20, 'VOLVER AL MENU', {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#aaccdd'
        }).setInteractive({ useHandCursor: true });

        back.on('pointerover', () => back.setColor('#ffffff'));
        back.on('pointerout', () => back.setColor('#aaccdd'));
        back.on('pointerdown', () => this.scene.start('MenuScene'));

        // Plataformas
        const platformData = [
            { x: 480, y: 445, width: 680, height: 24 },
            { x: 280, y: 310, width: 200, height: 18 },
            { x: 680, y: 310, width: 200, height: 18 }
        ];

        const platforms = [];

        for (const data of platformData) {
            const platform = this.add.rectangle(
                data.x, data.y, data.width, data.height, 0x466478
            ).setStrokeStyle(2, 0x80c9eb);

            this.physics.add.existing(platform, true);
            platform.body.updateFromGameObject();

            // Colisión solamente desde arriba
            platform.body.checkCollision.down = false;
            platform.body.checkCollision.left = false;
            platform.body.checkCollision.right = false;

            platforms.push(platform);
        }

        // Controles configurados
        this.controls = loadGameSettings().controls;
        this.keysDown = new Set();

        // Crear personajes usando la nueva clase
        this.bolt = new Robot(
            this, 300, 350, 'bolt', this.controls.bolt, false
        );

        this.rivet = new Robot(
            this, 660, 350, 'rivet', this.controls.rivet, true
        );

        // Colisiones con las plataformas
        for (const platform of platforms) {
            this.physics.add.collider(this.bolt, platform);
            this.physics.add.collider(this.rivet, platform);
        }

        // Teclas utilizadas por los jugadores
        const usedKeys = new Set([
            ...Object.values(this.controls.bolt),
            ...Object.values(this.controls.rivet)
        ]);

        // Teclas pulsadas
        const onKeyDown = (event) => {
            if (!usedKeys.has(event.code)) return;

            event.preventDefault();
            this.keysDown.add(event.code);

            if (event.repeat) return;

            if (event.code === this.controls.bolt.jump) {
                this.bolt.jump();
            }

            if (event.code === this.controls.rivet.jump) {
                this.rivet.jump();
            }
        };

        // Teclas soltadas
        const onKeyUp = (event) => {
            this.keysDown.delete(event.code);

            if (usedKeys.has(event.code)) {
                event.preventDefault();
            }
        };

        // Pérdida de foco del navegador
        const onBlur = () => {
            this.keysDown.clear();
        };

        this.input.keyboard.on('keydown', onKeyDown);
        this.input.keyboard.on('keyup', onKeyUp);
        this.game.events.on(Phaser.Core.Events.BLUR, onBlur);

        // Limpiar eventos al salir
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.input.keyboard.off('keydown', onKeyDown);
            this.input.keyboard.off('keyup', onKeyUp);
            this.game.events.off(Phaser.Core.Events.BLUR, onBlur);
            this.keysDown.clear();
        });

        // Indicaciones de controles
        const b = this.controls.bolt;
        const r = this.controls.rivet;

        const instructions = [
            `BOLT: ${keyLabel(b.left)} / ${keyLabel(b.right)} | Saltar: ${keyLabel(b.jump)}`,
            `RIVET: ${keyLabel(r.left)} / ${keyLabel(r.right)} | Saltar: ${keyLabel(r.jump)}`
        ].join('\n');

        this.add.text(480, 485, instructions, {
            fontFamily: 'Arial',
            fontSize: '15px',
            color: '#aaccdd',
            align: 'center',
            lineSpacing: 5
        }).setOrigin(0.5, 0);
    }

    update() {
        this.bolt.updateMovement(this.keysDown);
        this.rivet.updateMovement(this.keysDown);
    }
}
