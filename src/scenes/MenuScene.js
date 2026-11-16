
class MenuScene extends Phaser.Scene {

    constructor() {
        super('MenuScene');
    }

    create() {

        const centerX = this.scale.width / 2;

        // LOGOTIPO
        const logo = this.add.image(centerX, 95, 'logo');

        logo.setScale(Math.min(
            440 / logo.width,
            145 / logo.height,
            1
        ));

        // PERSONAJES
        const bolt = this.add.sprite(155, 280, 'bolt');
        bolt.setScale(3);
        bolt.play('bolt-idle');

        const rivet = this.add.sprite(805, 280, 'rivet');
        rivet.setScale(3);
        rivet.setFlipX(true);
        rivet.play('rivet-idle');

        // MENSAJE INFORMATIVO
        const status = this.add.text(
            centerX, 490,
            'Selecciona una opcion',
            {
                fontFamily: 'Arial',
                fontSize: '16px',
                color: '#aaccdd'
            }
        ).setOrigin(0.5);

        // OPCIONES DEL MENÚ
        const options = [
            { text: 'JUGAR LOCAL', y: 235 },
            { text: 'AJUSTES', y: 290 },
            { text: 'AYUDA', y: 345 },
            { text: 'CREDITOS', y: 400 }
        ];

        // CREAR BOTONES
        for (const option of options) {

            const button = this.add.rectangle(
                centerX,
                option.y,
                280,
                44,
                0x263e52
            );

            button.setStrokeStyle(2, 0x5aa5ce);

            this.add.text(
                centerX,
                option.y,
                option.text,
                {
                    fontFamily: 'Arial',
                    fontSize: '20px',
                    color: '#ffffff'
                }
            ).setOrigin(0.5);

            // Activar interacción
            button.setInteractive({ useHandCursor: true });

            // Ratón encima
            button.on('pointerover', () => {
                button.setFillStyle(0x3b6481);
            });

            // Ratón fuera
            button.on('pointerout', () => {
                button.setFillStyle(0x263e52);
            });

            // Clic
            button.on('pointerdown', () => {
                status.setText(
                    `${option.text}: pendiente de implementar`
                );
            });
        }
    }
}

