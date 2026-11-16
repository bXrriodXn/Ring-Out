
class MenuScene extends Phaser.Scene {

    constructor() {
        super('MenuScene');
    }

    create() {

        //Dividiendo el ancho y alto de imagen entre 2
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
        0.25
        ).setDepth(-0.5);
    
        // LOGOTIPO
        const logo = this.add.image(centerX, 100, 'logo');
        logo.setScale(Math.min(
            440 / logo.width,
            145 / logo.height,
            2
        ));

        const plataformaIzq = this.add.image(centerX - 320, 350, 'plataformaIzq');
        plataformaIzq.setScale(1);
        const plataformaDrch = this.add.image(centerX + 320, 350, 'plataformaDrch');
        plataformaDrch.setScale(1);

        // PERSONAJES
        const bolt = this.add.sprite(centerX - 320, 228, 'bolt');
        bolt.setScale(3);
        bolt.play('bolt-idle');

        const rivet = this.add.sprite(centerX + 320, 228, 'rivet');
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

       // Opciones del menú
        const options = [
            { texture: 'botonLocal', y: 205 },
            { texture: 'botonOnline', y: 263 },
            { texture: 'botonSettings', y: 321, target: 'SettingsScene' },
            { texture: 'botonHelp', y: 379, target: 'HelpScene' },
            { texture: 'botonCredits', y: 437, target: 'CreditsScene' }
        ];

         // Crear botones
        for (const option of options) {
            const button = this.add.image(centerX, option.y, option.texture);
            button.setScale(2);
            button.setInteractive({ useHandCursor: true });

            // Efecto al pasar el ratón
            button.on('pointerover', () => {
                button.setTint(0x99ccff);
                button.setAlpha(0.85);
            });

            button.on('pointerout', () => {
                button.clearTint();
                button.setAlpha(1);
            });

            // Clic
            button.on('pointerdown', () => {
                if (option.target) {
                    this.scene.start(option.target);
                    return;
                }

                const mode = option.texture === 'botonLocal' ? 'local' : 'online';
                status.setText(`Modo ${mode}: pendiente de implementar`);
            });
        }
    }
}
