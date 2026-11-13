
class BootScene extends Phaser.Scene {

    constructor() {
        super('BootScene');
    }

    create() {
        this.add.text(480, 120, 'RING OUT', {
            fontFamily: 'Arial',
            fontSize: '52px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(480, 200, 'Primera escena de Phaser 3', {
            fontFamily: 'Arial',
            fontSize: '22px',
            color: '#bbbbbb'
        }).setOrigin(0.5);

        this.add.rectangle(480, 400, 600, 24, 0x507c98);
    }
}
