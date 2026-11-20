
class ResultsScene extends Phaser.Scene {

    constructor() {
        super('ResultsScene');
    }

    init(data) {
        this.winner = data.winner;
        this.scores = data.scores;
    }

    create() {
        const centerX = this.scale.width / 2;
        const winnerColor = this.winner === 'bolt' ? '#38caff' : '#ff5577';

        // Título
        this.add.text(centerX, 75, 'FIN DE LA PARTIDA', {
            fontFamily: 'Arial',
            fontSize: '36px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Panel central
        this.add.rectangle(centerX, 260, 620, 260, 0x263e52)
            .setStrokeStyle(2, 0x5aa5ce);

        // Ganador
        this.add.text(centerX, 195, `VICTORIA DE ${this.winner.toUpperCase()}`, {
            fontFamily: 'Arial',
            fontSize: '30px',
            color: winnerColor,
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Marcador definitivo
        this.add.text(
            centerX, 270,
            `BOLT  ${this.scores.bolt}  -  ${this.scores.rivet}  RIVET`,
            {
                fontFamily: 'Arial',
                fontSize: '28px',
                color: '#ffffff'
            }
        ).setOrigin(0.5);

        // Personajes
        const bolt = this.add.sprite(240, 310, 'bolt').setScale(1.5);
        bolt.play('bolt-idle');

        const rivet = this.add.sprite(720, 310, 'rivet').setScale(1.5);
        rivet.setFlipX(true);
        rivet.play('rivet-idle');

        // Función para crear botones
        const createButton = (x, text, target) => {
            const button = this.add.rectangle(x, 445, 250, 50, 0x263e52)
                .setStrokeStyle(2, 0x5aa5ce)
                .setInteractive({ useHandCursor: true });

            this.add.text(x, 445, text, {
                fontFamily: 'Arial',
                fontSize: '19px',
                color: '#ffffff'
            }).setOrigin(0.5);

            button.on('pointerover', () => button.setFillStyle(0x3b6481));
            button.on('pointerout', () => button.setFillStyle(0x263e52));
            button.on('pointerdown', () => this.scene.start(target));
        };

        createButton(330, 'REVANCHA', 'GameScene');
        createButton(630, 'VOLVER AL MENU', 'MenuScene');
    }
}
