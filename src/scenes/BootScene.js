
class BootScene extends Phaser.Scene {

    constructor() {
        super('BootScene');
    }
    // es uno de los métodos principales del ciclo de vida de Phaser. Permite 
    // cargar recursos antes de crear los objetos de una escena.
    preload() {

    this.load.image('logo', 'img/logo_pixel.png');
    this.load.image('plataformaIzq', 'assets/sprites/plataforma_izquierda.png');
    this.load.image('plataformaDrch', 'assets/sprites/plataforma_derecha.png');
    // Fondo del menú principal
    this.load.image('fondoMenu', 'assets/backgrounds/fondoMenu.png');

       this.load.spritesheet('bolt', 'assets/sprites/bolt.png', {
            frameWidth: 64,
            frameHeight: 64
        });

        this.load.spritesheet('rivet', 'assets/sprites/rivet.png', {
            frameWidth: 64,
            frameHeight: 64
        });

        // Imágenes de los botones del menú principal
    this.load.image('botonLocal', 'assets/sprites/botonLocal.png');
    this.load.image('botonOnline', 'assets/sprites/botonOnline.png');
    this.load.image('botonSettings', 'assets/sprites/botonSettings.png');
    this.load.image('botonHelp', 'assets/sprites/botonHelp.png');
    this.load.image('botonCredits', 'assets/sprites/botonCredits.png');
        
        // Sprites de armas
    this.load.image('weapon_gloves', 'assets/sprites/weapon_gloves.png');
    this.load.image('weapon_sword', 'assets/sprites/weapon_sword.png');
    this.load.image('weapon_spear', 'assets/sprites/weapon_spear.png');
    this.load.image('weapon_hammer', 'assets/sprites/weapon_hammer.png');

        this.load.spritesheet('roundMarkers', 'assets/sprites/rondas_spritesheet.png', {
            frameWidth: 32,
            frameHeight: 32
        });

}


    create() {
    
    // Esto permite recuperar el volumen almacenado 
    // cuando arrancamos el juego.    
    this.sound.volume = loadGameSettings().volume;
     
        
    // Registrar las animaciones de ambos robots
     registerRobotAnimations(this, 'bolt');
        registerRobotAnimations(this, 'rivet');

    // Pasar al menú principal
    this.scene.start('MenuScene');
    
   
    
    }
}
