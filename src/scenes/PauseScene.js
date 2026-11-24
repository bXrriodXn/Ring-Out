
class PauseScene extends Phaser.Scene {

    constructor() {
        super('PauseScene');
    }

    init(data) {
        this.owner = data.owner;
        this.resumeKey = data.resumeKey;
    }

    create() {
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        // Oscurecer la partida sin ocultarla
        this.add.rectangle(
            centerX, centerY, 960, 540, 0x000000, 0.65
        );

        // Panel de pausa
       // Color según el jugador que ha pausado
        const pauseColor = this.owner === 'bolt' ? 0x38caff : 0xff5577;

        // Marco exterior
        this.add.rectangle(
            centerX, centerY, 516, 316, pauseColor, 0.12
        ).setStrokeStyle(5, pauseColor);

        // Panel interior
        this.add.rectangle(
            centerX, centerY, 500, 300, 0x263e52
        ).setStrokeStyle(2, pauseColor);

        this.add.text(centerX, 180, 'PARTIDA EN PAUSA', {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(
            centerX, 240,
            `Pausa iniciada por ${this.owner.toUpperCase()}`,
            {
                fontFamily: 'Arial',
                fontSize: '20px',
                color: this.owner === 'bolt' ? '#38caff' : '#ff5577'
            }
        ).setOrigin(0.5);

        this.add.text(
            centerX, 295,
            `Pulsa ${keyLabel(this.resumeKey)} para CONTINUAR`,
            {
                fontFamily: 'Arial',
                fontSize: '20px',
                color: '#ffffff'
            }
        ).setOrigin(0.5);

        // Volver al menú principal
        const back = this.add.rectangle(
            centerX, 370, 280, 48, 0x263e52
        ).setStrokeStyle(2, 0x5aa5ce);

        this.add.text(centerX, 370, 'VOLVER AL MENU', {
            fontFamily: 'Arial',
            fontSize: '19px',
            color: '#ffffff'
        }).setOrigin(0.5);

        back.setInteractive({ useHandCursor: true });

        back.on('pointerover', () => back.setFillStyle(0x3b6481));
        back.on('pointerout', () => back.setFillStyle(0x263e52));

        back.on('pointerdown', () => {
            this.sound.play('sfxBack', { volume: 0.6 });
            this.scene.stop('GameScene');
            this.scene.start('MenuScene');
        });

        // Solo la tecla del jugador que pausó permite continuar
        const onKeyDown = (event) => {
            if (event.repeat || event.code !== this.resumeKey) return;

            event.preventDefault();

            this.scene.resume('GameScene');
            this.sound.play('sfxClick', { volume: 0.7 });
            this.scene.stop();
        };

        this.input.keyboard.on('keydown', onKeyDown);

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.input.keyboard.off('keydown', onKeyDown);
        });
    }
}
