
class BootScene extends Phaser.Scene {

    constructor() {
        super('BootScene');
    }
    // es uno de los métodos principales del ciclo de vida de Phaser. Permite 
    // cargar recursos antes de crear los objetos de una escena.
    preload() {
    this.load.image('logo', 'img/logo_pixel.png');

       this.load.spritesheet('bolt', 'assets/sprites/bolt.png', {
            frameWidth: 64,
            frameHeight: 64
        });

        this.load.spritesheet('rivet', 'assets/sprites/rivet.png', {
            frameWidth: 64,
            frameHeight: 64
        });

}

    create() {
    
        const logo = this.add.image(480, 120, 'logo');
        const escala = Math.min(
            500 / logo.width,
            180 / logo.height,
            2
        );
        logo.setScale(escala);

        this.add.text(800, 30, 'Primera escena de Phaser 3', {
            fontFamily: 'Arial',
            fontSize: '22px',
            color: '#bbbbbb'
        }).setOrigin(0.5);
     
        
       // Registrar las animaciones de ambos robots
        registerRobotAnimations(this, 'bolt');
        registerRobotAnimations(this, 'rivet');

       // Crear personajes
        const bolt = this.add.sprite(310, 392, 'bolt');
        const rivet = this.add.sprite(650, 392, 'rivet');

        bolt.setScale(3);
        rivet.setScale(3);
        rivet.setFlipX(true);
        

        //rivet.setScale(-3,3);
    

        // Iniciar las animaciones Idle
        bolt.play('bolt-idle');
        rivet.play('rivet-idle');

        // Agrupar los personajes
        const robots = [
            { name: 'bolt', sprite: bolt },
            { name: 'rivet', sprite: rivet }
        ];


        // Plataforma visual provisional
        this.add.rectangle(480, 500, 620, 18, 0x507c98);

        // Instrucciones
        this.add.text(
            480, 230,
            '1: Idle   2: Walk   3: Jump   4: Hurt   5: Death',
            {
                fontFamily: 'Arial',
                fontSize: '19px',
                color: '#ffffff'
            }
        ).setOrigin(0.5);

        const status = this.add.text(
            480, 265,
            'Animacion: Idle',
            {
                fontFamily: 'Arial',
                fontSize: '18px',
                color: '#66ccff'
            }
        ).setOrigin(0.5);

        // Controles de prueba
        const controls = {
            Digit1: 'idle',
            Digit2: 'walk',
            Digit3: 'jump',
            Digit4: 'hurt',
            Digit5: 'death'
        };

        this.input.keyboard.on('keydown', (event) => {

            if (event.repeat) return;

            const action = controls[event.code];
            if (!action) return;

            // Reproducir la misma acción en ambos robots
            for (const robot of robots) {
                robot.sprite.play(`${robot.name}-${action}`);
            }

            status.setText(`Animacion: ${action}`);
        });


    }
}
