
class Robot extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, name, controls, facingLeft = false) {
        super(scene, x, y, name, 0);

        // Añadir el robot a la escena y a las físicas
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Datos propios del personaje
        this.robotName = name;
        this.controls = controls;
        this.spawnX = x;
        this.spawnY = y;
        this.initialFacingLeft = facingLeft;

        // Aspecto y cuerpo físico
        this.setScale(1.5);
        this.setFlipX(facingLeft);
        this.setCollideWorldBounds(false);

        this.body.setSize(34, 56, false);
        this.body.setOffset(15, 6);

        this.play(`${name}-idle`);
    }

    // Comprobar si está apoyado sobre una plataforma
    isGrounded() {
        return (
            (this.body.blocked.down || this.body.touching.down) &&
            this.body.velocity.y >= 0
        );
    }

    // Saltar
    jump() {
        if (!this.isGrounded()) return;

        this.setVelocityY(-600);
    }

    // Actualizar movimiento y animaciones
    updateMovement(keysDown) {
        const left = keysDown.has(this.controls.left);
        const right = keysDown.has(this.controls.right);

        const direction = Number(right) - Number(left);

        // Movimiento horizontal
        this.setVelocityX(direction * 230);

        // Orientación
        if (direction !== 0) {
            this.setFlipX(direction < 0);
        }

        // Seleccionar animación
        let animation;

        if (!this.isGrounded()) {
            animation = this.body.velocity.y < 0
                ? `${this.robotName}-rise`
                : `${this.robotName}-fall`;
        } else if (direction !== 0) {
            animation = `${this.robotName}-walk`;
        } else {
            animation = `${this.robotName}-idle`;
        }

        if (this.anims.currentAnim?.key !== animation) {
            this.play(animation);
        }

        // Reaparición provisional tras caer de la arena
        if (this.y > 620) {
            this.respawn();
        }
    }

    // Volver a la posición inicial
    respawn() {
        this.body.reset(this.spawnX, this.spawnY);
        this.setFlipX(this.initialFacingLeft);
        this.play(`${this.robotName}-idle`);
    }
}
