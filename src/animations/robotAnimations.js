// Registra una animación en el gestor de animaciones de Phaser.

function registerBoltAnimations(scene) {

    const animations = {
        idle:  { start: 0,  end: 5,  fps: 6,  repeat: -1 },
        walk:  { start: 8,  end: 13, fps: 12, repeat: -1 },
        jump:  { start: 16, end: 23, fps: 10, repeat: 0 },
        hurt:  { start: 24, end: 27, fps: 16, repeat: 0 },
        death: { start: 32, end: 39, fps: 10, repeat: 0 }
    };

    for (const [name, data] of Object.entries(animations)) {

        const key = `bolt-${name}`;

        if (scene.anims.exists(key)) {
            continue;
        }

        scene.anims.create({
            key: key,
            frames: scene.anims.generateFrameNumbers('bolt', {
                start: data.start,
                end: data.end
            }),
            frameRate: data.fps,
            repeat: data.repeat
        });
    }
}
