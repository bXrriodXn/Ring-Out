
class HelpScene extends Phaser.Scene {

    constructor() {
        super('HelpScene');
    }

    create() {
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

         // Fondo del menú
        const fondo = this.add.image(centerX, centerY, 'fondoMenu');
        fondo.setDisplaySize(this.scale.width, this.scale.height);
        fondo.setDepth(-1);

        // Capa oscura semitransparente
        this.add.rectangle(
        centerX,
        centerY,
        this.scale.width,
        this.scale.height,
        0x000000,
        0.5
        ).setDepth(-0.5);

        // Título de la pantalla
        this.add.text(centerX, 55, 'COMO JUGAR', {
            fontFamily: 'Arial',
            fontSize: '36px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Objetivo del juego
        this.add.text(
            centerX, 110,
            'Empuja a tu rival fuera de la arena o contra los pinchos',
            {
                fontFamily: 'Arial',
                fontSize: '19px',
                color: '#dddddd'
            }
        ).setOrigin(0.5);

        this.add.text(centerX, 145, 'PRIMERO EN GANAR 3 RONDAS', {
            fontFamily: 'Arial',
            fontSize: '21px',
            color: '#ffcc66'
        }).setOrigin(0.5);

        // Paneles de controles
        this.add.rectangle(255, 295, 390, 220, 0x263e52)
            .setStrokeStyle(2, 0x38caff);

        this.add.rectangle(705, 295, 390, 220, 0x263e52)
            .setStrokeStyle(2, 0xff5577);

        // Controles de Bolt
        this.add.text(255, 215, 'BOLT', {
            fontFamily: 'Arial',
            fontSize: '26px',
            color: '#38caff'
        }).setOrigin(0.5);

        this.add.text(110, 250,
            'A / D  -  Moverse\n' +
            'W  -  Saltar\n' +
            'Espacio  -  Atacar\n' +
            'Esc  -  Pausa', {
                fontFamily: 'Arial',
                fontSize: '19px',
                color: '#ffffff',
                lineSpacing: 10
            }
        );

        // Controles de Rivet
        this.add.text(705, 215, 'RIVET', {
            fontFamily: 'Arial',
            fontSize: '26px',
            color: '#ff5577'
        }).setOrigin(0.5);

        this.add.text(560, 250,
            'Flechas  -  Moverse\n' +
            'Flecha arriba  -  Saltar\n' +
            'Enter  -  Atacar\n' +
            'P  -  Pausa', {
                fontFamily: 'Arial',
                fontSize: '19px',
                color: '#ffffff',
                lineSpacing: 10
            }
        );

        // Botón para volver
        const backButton = this.add.rectangle(
            centerX, 465, 240, 45, 0x263e52
        );

        backButton.setStrokeStyle(2, 0x5aa5ce);

        this.add.text(centerX, 465, 'VOLVER AL MENU', {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(0.5);

        backButton.setInteractive({ useHandCursor: true });

        backButton.on('pointerover', () => {
            backButton.setFillStyle(0x3b6481);
        });

        backButton.on('pointerout', () => {
            backButton.setFillStyle(0x263e52);
        });

        backButton.on('pointerdown', () => {
             this.sound.play('sfxBack', { volume: 0.6 });
            this.scene.start('MenuScene');
        });
    }
}
