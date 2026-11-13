// Este archivo contiene Notas para
// facilitar la comprensión entre miembros del equipo.


// Objeto de JavaScript que contiene
// las opciones con las que arrancará Phaser.

const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 960,
    height: 540,
    backgroundColor: '#1b1d2a',

    // El cargador de escenas va a parte
    scene: [BootScene]
};

const game = new Phaser.Game(config);
