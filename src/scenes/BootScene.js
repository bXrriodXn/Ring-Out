
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
    
    // Esto permite recuperar el volumen almacenado 
    // cuando arrancamos el juego.    
   
     
        
    // Registrar las animaciones de ambos robots
     registerRobotAnimations(this, 'bolt');
        registerRobotAnimations(this, 'rivet');

    // Pasar al menú principal
    this.scene.start('MenuScene');
    
    this.sound.volume = loadGameSettings().volume;
    
    }
}
