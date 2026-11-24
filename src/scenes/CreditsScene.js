
class CreditsScene extends Phaser.Scene {

    constructor() {
        super('CreditsScene');
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

        // Título
        this.add.text(centerX, 55, 'CREDITOS', {
            fontFamily: 'Arial',
            fontSize: '36px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Panel central
        this.add.rectangle(
            centerX, 280, 640, 310, 0x263e52
        ).setStrokeStyle(2, 0x5aa5ce);

        // Desarrollo
        this.add.text(centerX, 160, 'DESARROLLO', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#38caff'
        }).setOrigin(0.5);

        this.add.text(centerX, 195, 'Grupo E - Juegos en Red', {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Tecnología
        this.add.text(centerX, 255, 'TECNOLOGIAS', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#38caff'
        }).setOrigin(0.5);

        this.add.text(centerX, 290, 'Phaser 3 - JavaScript - HTML - CSS', {
            fontFamily: 'Arial',
            fontSize: '19px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Recursos
        this.add.text(centerX, 345, 'RECURSOS Y ATRIBUCIONES', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#38caff'
        }).setOrigin(0.5);

        this.add.text(
            centerX, 385,
            'Integrantes y atribuciones: consultar README.md',
            {
                fontFamily: 'Arial',
                fontSize: '17px',
                color: '#dddddd'
            }
        ).setOrigin(0.5);

        // Botón volver
        const backButton = this.add.rectangle(
            centerX, 485, 250, 45, 0x263e52
        );

        backButton.setStrokeStyle(2, 0x5aa5ce);

        this.add.text(centerX, 485, 'VOLVER AL MENU', {
            fontFamily: 'Arial',
            fontSize: '19px',
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
