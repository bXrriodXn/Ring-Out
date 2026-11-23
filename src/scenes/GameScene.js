

class GameScene extends Phaser.Scene {

    constructor() {
        super('GameScene');
    }

    create() {

        // Establecemos el fondo
        this.cameras.main.setBackgroundColor('#172638');
       
        // Título
        this.arenaNameText = this.add.text(480, 55, 'ARENA', {
            fontFamily: 'Arial',
            fontSize: '28px',
            color: '#ffffff'
        }).setOrigin(0.5);



        // Estado de la partida
        this.scores = { bolt: 0, rivet: 0 };
        this.roundNumber = 1;
        this.roundActive = true;
        this.weaponPickups = [];

        // Orden aleatorio de arenas
        this.arenaOrder = Phaser.Utils.Array.Shuffle([...ARENAS]);
        this.arenaIndex = 0;
        this.currentArena = null;

        // Elementos que cambian entre arenas
        this.arenaPlatforms = [];
        this.arenaColliders = [];
        this.arenaHazards = [];
        this.hazardHits = { bolt: false, rivet: false };

        // Marcadores visuales de rondas
      
    
        // HUD de los jugadores
        const hudScale = 1;
        const hudY = 8;
        const boltHudX = 8;
        const rivetHudX = this.scale.width - 276 * hudScale - 8;

        // Retratos animados, detrás de los marcos
        const boltPortrait = this.add.sprite(
            boltHudX + 63 * hudScale,
            hudY + 67 * hudScale,
            'bolt'
        ).setScale(1.55).setDepth(99);

        boltPortrait.play('bolt-idle');

        const rivetPortrait = this.add.sprite(
            rivetHudX + 213 * hudScale,
            hudY + 67 * hudScale,
            'rivet'
        ).setScale(1.55).setFlipX(true).setDepth(99);

        rivetPortrait.play('rivet-idle');

        // Marcos del HUD
        this.add.image(boltHudX, hudY, 'hudBolt')
            .setOrigin(0).setScale(hudScale).setDepth(100);

        this.add.image(rivetHudX, hudY, 'hudRivet')
            .setOrigin(0).setScale(hudScale).setDepth(100);

        // Indicadores de rondas
        this.roundMarkers = { bolt: [], rivet: [] };

        for (let i = 0; i < 3; i++) {
            const blue = this.add.sprite(
                boltHudX + (155 + i * 44) * hudScale,
                hudY + 51 * hudScale,
                'roundMarkers', 0
            ).setScale(hudScale).setDepth(101);

            const red = this.add.sprite(
                rivetHudX + (123 - i * 44) * hudScale,
                hudY + 51 * hudScale,
                'roundMarkers', 0
            ).setScale(hudScale).setDepth(101);

            this.roundMarkers.bolt.push(blue);
            this.roundMarkers.rivet.push(red);
        }

        // Iconos de armas equipadas
        this.weaponIcons = {
            bolt: this.add.image(
                boltHudX + 141 * hudScale,
                hudY + 104 * hudScale,
                'weapon_gloves'
            ).setScale(hudScale).setDepth(102).setVisible(false),

            rivet: this.add.image(
                rivetHudX + 134 * hudScale,
                hudY + 104 * hudScale,
                'weapon_gloves'
            ).setScale(hudScale).setDepth(102).setVisible(false)
        };

        // Mensajes de ronda
        this.roundMessage = this.add.text(480, 20, 'RONDA 1', {
            fontFamily: 'Arial',
            fontSize: '21px',
            color: '#ffcc66',
            align: 'center'
        }).setOrigin(0.5);

     
        // Controles configurados
        this.controls = loadGameSettings().controls;
        this.keysDown = new Set();

        const playerSpawns = this.arenaOrder[0].playerSpawns;

        // Crear personajes usando la clase Robot
        this.bolt = new Robot(
            this,
            playerSpawns.bolt.x,
            playerSpawns.bolt.y,
            'bolt',
            this.controls.bolt,
            false
        );

        this.rivet = new Robot(
            this,
            playerSpawns.rivet.x,
            playerSpawns.rivet.y,
            'rivet',
            this.controls.rivet,
            true
        );

                      

        // Construir la primera arena
        this.buildArena(this.arenaOrder[this.arenaIndex]);
         

        // Teclas utilizadas por los jugadores
        const usedKeys = new Set([
            ...Object.values(this.controls.bolt),
            ...Object.values(this.controls.rivet)
        ]);

        // Teclas pulsadas
 
        const onKeyDown = (event) => {
            if (!usedKeys.has(event.code)) return;

            event.preventDefault();
            if (event.repeat) return;

            // Pausa de cada jugador
            if (event.code === this.controls.bolt.pause) {
                this.pauseGame('bolt');
                return;
            }

            if (event.code === this.controls.rivet.pause) {
                this.pauseGame('rivet');
                return;
            }

            if (!this.roundActive) return;

            this.keysDown.add(event.code);

            // Saltos
            if (event.code === this.controls.bolt.jump) {
                this.bolt.jump();
            }

            if (event.code === this.controls.rivet.jump) {
                this.rivet.jump();
            }

            // Ataques
            if (event.code === this.controls.bolt.attack) {
                this.bolt.attack(this.rivet);
            }

            if (event.code === this.controls.rivet.attack) {
                this.rivet.attack(this.bolt);
            }
        };


        // Teclas soltadas
        const onKeyUp = (event) => {
            this.keysDown.delete(event.code);

            if (usedKeys.has(event.code)) {
                event.preventDefault();
            }
        };

        // Pérdida de foco del navegador
        const onBlur = () => {
            this.keysDown.clear();
        };

        this.input.keyboard.on('keydown', onKeyDown);
        this.input.keyboard.on('keyup', onKeyUp);
        this.game.events.on(Phaser.Core.Events.BLUR, onBlur);

        // Limpiar eventos al salir
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.input.keyboard.off('keydown', onKeyDown);
            this.input.keyboard.off('keyup', onKeyUp);
            this.game.events.off(Phaser.Core.Events.BLUR, onBlur);
            this.keysDown.clear();
        });

        // Indicaciones de controles
        const b = this.controls.bolt;
        const r = this.controls.rivet;


        
    }


    buildArena(arena) {

        // Eliminar colisiones y objetos de la arena anterior
        this.arenaColliders.forEach(collider => collider.destroy());
        this.arenaPlatforms.forEach(platform => platform.destroy());
        this.weaponPickups.forEach(pickup => pickup.destroy());

        // Limpiar los pinchos anteriores
        this.arenaHazards.forEach(hazard => {
            hazard.visual.destroy();
            hazard.sensor.destroy();
        });

        this.arenaHazards = [];        
        this.arenaColliders = [];
        this.arenaPlatforms = [];
        this.weaponPickups = [];

        this.hazardHits = { bolt: false, rivet: false };

        this.currentArena = arena;
        this.arenaNameText.setText(arena.name);

        // Crear plataformas
        for (const data of arena.platforms) {
            const platform = this.add.rectangle(
                data.x, data.y, data.width, data.height, 0x466478
            ).setStrokeStyle(2, 0x80c9eb).setDepth(-1);

            this.physics.add.existing(platform, true);
            platform.body.updateFromGameObject();

            platform.body.checkCollision.down = false;
            platform.body.checkCollision.left = false;
            platform.body.checkCollision.right = false;

            this.arenaPlatforms.push(platform);

            this.arenaColliders.push(
                this.physics.add.collider(this.bolt, platform)
            );

            this.arenaColliders.push(
                this.physics.add.collider(this.rivet, platform)
            );
        }

        // Crear los pinchos de la arena
        for (const spike of (arena.spikes || [])) {

            // Representación visual
            const visual = this.add.graphics().setDepth(-0.5);
            visual.fillStyle(0xff4f5e, 1);

            const left = spike.x - spike.width / 2;
            const bottom = spike.y + spike.height / 2;

            for (let x = left; x < left + spike.width; x += 16) {
                visual.fillTriangle(
                    x, bottom,
                    Math.min(x + 8, left + spike.width),
                    bottom - spike.height,
                    Math.min(x + 16, left + spike.width),
                    bottom
                );
            }

            // Zona de detección invisible
            const sensor = this.add.zone(
                spike.x, spike.y, spike.width, spike.height
            );

            this.physics.add.existing(sensor, true);
            sensor.body.updateFromGameObject();

            // Registrar el contacto de cada jugador
            for (const robot of [this.bolt, this.rivet]) {
                const overlap = this.physics.add.overlap(
                    robot,
                    sensor,
                    () => {
                        if (this.roundActive) {
                            this.hazardHits[robot.robotName] = true;
                        }
                    }
                );

                this.arenaColliders.push(overlap);
            }

            this.arenaHazards.push({ visual, sensor });
        }

        // Actualizar posiciones iniciales
        this.bolt.spawnX = arena.playerSpawns.bolt.x;
        this.bolt.spawnY = arena.playerSpawns.bolt.y;

        this.rivet.spawnX = arena.playerSpawns.rivet.x;
        this.rivet.spawnY = arena.playerSpawns.rivet.y;

        this.bolt.respawn();
        this.rivet.respawn();

        // Crear las dos armas de la arena
        for (const spawn of arena.weaponSpawns) {
            const pickup = this.physics.add.staticImage(
                spawn.x, spawn.y, `weapon_${spawn.type}`
            );

            pickup.setScale(1.5);
            pickup.refreshBody();
            pickup.weaponType = spawn.type;

            const collect = (robot) => {
            if (!this.roundActive || !pickup.active) return;

            // No recoger si ya tiene un arma
            if (!robot.equipWeapon(pickup.weaponType)) return;

            // Mostrar el arma en el HUD
            this.weaponIcons[robot.robotName]
                .setTexture(`weapon_${robot.weaponType}`)
                .setVisible(true);

            // Retirar el arma recogida de la arena
            pickup.disableBody(true, true);
        };

            this.arenaColliders.push(
                this.physics.add.overlap(this.bolt, pickup, () => collect(this.bolt))
            );

            this.arenaColliders.push(
                this.physics.add.overlap(this.rivet, pickup, () => collect(this.rivet))
            );

            this.weaponPickups.push(pickup);
        }

        this.weaponIcons.bolt.setVisible(false);
        this.weaponIcons.rivet.setVisible(false);
    }

    // La escena de pausa recibe dos datos: 
    // quién la ha iniciado y qué tecla permite reanudar.

    pauseGame(player) {
        if (this.scene.isActive('PauseScene')) return;

        this.keysDown.clear();

        this.scene.pause();
        this.scene.launch('PauseScene', {
            owner: player,
            resumeKey: this.controls[player].pause
        });
    }

    update(time, delta) {
        if (!this.roundActive) return;

        this.bolt.updateMovement(this.keysDown, delta);
        this.rivet.updateMovement(this.keysDown, delta);


        //Detectamos derrota
        // Comprobar caídas o pinchos tocados
        
        const boltOut =
            this.bolt.y > this.currentArena.fallLimit ||
            this.hazardHits.bolt;

        const rivetOut =
            this.rivet.y > this.currentArena.fallLimit ||
            this.hazardHits.rivet;

        if (boltOut && rivetOut) {
            this.finishRound(null);
        } else if (boltOut) {
            this.finishRound('rivet');
        } else if (rivetOut) {
            this.finishRound('bolt');
        }
    }

    // Método de actualización

    //Si Bolt tiene dos victorias, 
    //los indicadores con índice 0 y 1 
    //mostrarán el fotograma azul. El tercero seguirá vacío.

    // Si Rivet tiene una victoria, 
    //solo su primer indicador mostrará el fotograma rojo.

    updateRoundMarkers() {

        this.roundMarkers.bolt.forEach((marker, index) => {
            marker.setFrame(index < this.scores.bolt ? 1 : 0);
        });

        this.roundMarkers.rivet.forEach((marker, index) => {
            marker.setFrame(index < this.scores.rivet ? 2 : 0);
        });
    }


            finishRound(winner) {
                if (!this.roundActive) return;

                this.roundActive = false;
                this.keysDown.clear();
                this.physics.pause();

                if (winner) {
                    this.scores[winner]++;

                    const loser = winner === 'bolt' ? 'rivet' : 'bolt';
                    const robot = loser === 'bolt' ? this.bolt : this.rivet;

                    robot.play(`${loser}-death`);
                } else {
                    this.bolt.play('bolt-death');
                    this.rivet.play('rivet-death');
                }
        
                // Actualizar indicadores visuales
                this.updateRoundMarkers();

                // Comprobar final de partida
                if (winner && this.scores[winner] >= 3) {
                    this.roundMessage.setText(
                        `¡${winner.toUpperCase()} GANA LA PARTIDA!`
                    );

                    this.time.delayedCall(1800, () => {
                        this.physics.resume();

                        this.scene.start('ResultsScene', {
                            winner: winner,
                            scores: { ...this.scores }
                        });
                    });

                    return;
                }

                this.roundMessage.setText(
                    winner
                        ? `¡RONDA PARA ${winner.toUpperCase()}!`
                        : '¡EMPATE! SE REPITE LA RONDA'
                );

                // Preparar siguiente ronda
                this.time.delayedCall(1800, () => {
                    this.startNextRound(winner !== null);
                });
            }




    startNextRound(advanceNumber) {

        if (advanceNumber) {
            this.roundNumber++;
            this.arenaIndex++;

            // Al terminar el ciclo, volver a mezclar las arenas
            if (this.arenaIndex >= this.arenaOrder.length) {
                this.arenaOrder = Phaser.Utils.Array.Shuffle([...ARENAS]);
                this.arenaIndex = 0;
            }
        }

        // Reconstruir la arena y reiniciar los personajes
        this.buildArena(this.arenaOrder[this.arenaIndex]);

        this.roundMessage.setText(`RONDA ${this.roundNumber}`);

        this.keysDown.clear();
        this.physics.resume();
        this.roundActive = true;
    }


}
