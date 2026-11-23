
class Robot extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, name, controls, facingLeft = false) {
        super(scene, x, y, name, 0);

        // La instancia de Robot se construye sin arma
        this.weaponType = 'none';

        // Añadir el robot a la escena y a las físicas
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Datos propios del personaje
        this.robotName = name;
        this.controls = controls;
        this.spawnX = x;
        this.spawnY = y;
        this.initialFacingLeft = facingLeft;

        // Estado del combate
        this.knockbackX = 0;
        this.nextAttackAt = 0;

        this.isHurt = false;

        this.on('animationcomplete', (animation) => {
            if (animation.key === `${this.robotName}-hurt`) {
                this.isHurt = false;
            }
        });

        // Aspecto y cuerpo físico
        this.setScale(1);
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
        if (!this.isGrounded()) return false;

        this.setVelocityY(-600);
        return true;
    }


    equipWeapon(type) {
    // Si ya tiene un arma, no puede recoger otra
    if (this.weaponType !== 'none') return false;

    if (!WEAPONS[type] || type === 'none') return false;

    this.weaponType = type;
    return true;
    }

    attack(opponent) {

    const now = this.scene.time.now;
    const weapon = WEAPONS[this.weaponType];

    if (now < this.nextAttackAt) return;
    this.nextAttackAt = now + weapon.cooldown;

    const direction = this.flipX ? -1 : 1;
    const reach = weapon.reach;

    const area = new Phaser.Geom.Rectangle(
        direction > 0
            ? this.body.x + this.body.width
            : this.body.x - reach,
        this.body.y + 10,
        reach,
        this.body.height - 20
    );

    const opponentArea = new Phaser.Geom.Rectangle(
        opponent.body.x,
        opponent.body.y,
        opponent.body.width,
        opponent.body.height
    );

    const hit = Phaser.Geom.Intersects.RectangleToRectangle(
        area, opponentArea
    );

    if (hit) {
        opponent.receiveKnockback(direction * weapon.force);
    }

    // Efecto visual del ataque
    const effect = this.scene.add.rectangle(
        area.centerX,
        area.centerY,
        area.width,
        area.height,
        hit ? 0xff7744 : 0xffd466,
        0.35
    ).setDepth(10);

    this.scene.tweens.add({
        targets: effect,
        alpha: 0,
        duration: 130,
        onComplete: () => effect.destroy()
    });
}

    receiveKnockback(speed) {
        this.knockbackX = Phaser.Math.Clamp(
            this.knockbackX + speed,
            -900,
            900
        );

        // Mirar hacia el lado del que viene el golpe
        this.setFlipX(speed > 0);


        // Cada golpe acertado activará
        // la animación correspondiente al robot.
        this.isHurt = true;
        this.play(`${this.robotName}-hurt`);
    }

    // Actualizar movimiento y animaciones
    updateMovement(keysDown, delta)  {
        const left = keysDown.has(this.controls.left);
        const right = keysDown.has(this.controls.right);

        const direction = Number(right) - Number(left);

        // Movimiento voluntario + empuje
        this.setVelocityX(direction * 230 + this.knockbackX);

        // Reducir gradualmente el empuje
        const reduction = 1000 * (delta / 1000);
        const magnitude = Math.max(
            0,
            Math.abs(this.knockbackX) - reduction
        );

        this.knockbackX = Math.sign(this.knockbackX) * magnitude;

        // Orientación
        if (direction !== 0 && !this.isHurt) {
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

        // Así, mientras isHurt sea true, 
        // las animaciones normales no interrumpirán el golpe.

        // Cuando hurt termine, el evento
        // animationcomplete pondrá isHurt
        //en false y se recuperará idle, walk, rise o fall.

        if (!this.isHurt && this.anims.currentAnim?.key !== animation) {
            this.play(animation);
        }

        
    }

    // Volver a la posición inicial
    respawn() {

        this.knockbackX = 0;
        this.nextAttackAt = 0;
        this.body.reset(this.spawnX, this.spawnY);
        this.setFlipX(this.initialFacingLeft);
        this.play(`${this.robotName}-idle`);
        this.weaponType = 'none';
        this.isHurt = false;
    }
}
