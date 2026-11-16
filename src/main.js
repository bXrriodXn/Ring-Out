// Este archivo contiene Notas para
// facilitar la comprensi�n entre miembros del equipo.


// Objeto de JavaScript que contiene
// las opciones con las que arrancar� Phaser.

const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 960,
    height: 540,
    backgroundColor: '#1b1d2a',
   
    // Para evitar filtros
    //  y que se vea borroso el personaje que es pixel art
    pixelArt: true,

    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: true
        }
    },

    // El cargador de escenas va a parte
    scene: [BootScene,MenuScene,HelpScene,SettingsScene,CreditsScene, GameScene]
};

const game = new Phaser.Game(config);
