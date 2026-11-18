

class GameScene extends Phaser.Scene {

    constructor() {
        super('GameScene');
    }

    create() {

        // Establecemos el fondo
        this.cameras.main.setBackgroundColor('#172638');
       


        // Título
        this.add.text(480, 55, 'ARENA DE ENTRENAMIENTO', {
            fontFamily: 'Arial',
            fontSize: '28px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Volver al menú
        const back = this.add.text(25, 20, 'VOLVER AL MENU', {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#aaccdd'
        }).setInteractive({ useHandCursor: true });

        back.on('pointerover', () => back.setColor('#ffffff'));
        back.on('pointerout', () => back.setColor('#aaccdd'));
        back.on('pointerdown', () => this.scene.start('MenuScene'));

        // Estado de la partida
        this.scores = { bolt: 0, rivet: 0 };
        this.roundNumber = 1;
        this.roundActive = true;
        this.weaponPickups = [];


        // Marcadores visuales de rondas
        this.roundMarkers = {
            bolt: [],
            rivet: []
        };

        for (let i = 0; i < 3; i++) {
            // Bolt: izquierda
            const blueMarker = this.add.sprite(75 + i * 46, 155, 'roundMarkers', 0);
            blueMarker.setScale(1.5);
            this.roundMarkers.bolt.push(blueMarker);

            // Rivet: derecha
            const redMarker = this.add.sprite(885 - i * 46, 155, 'roundMarkers', 0);
            redMarker.setScale(1.5);
            this.roundMarkers.rivet.push(redMarker);
        }

        // Marcador
        this.scoreText = this.add.text(480, 105, 'BOLT 0 - 0 RIVET', {
            fontFamily: 'Arial',
            fontSize: '22px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Mensajes de ronda
        this.roundMessage = this.add.text(480, 145, 'RONDA 1', {
            fontFamily: 'Arial',
            fontSize: '21px',
            color: '#ffcc66',
            align: 'center'
        }).setOrigin(0.5);

        // Plataformas
        const platformData = [
            { x: 480, y: 445, width: 680, height: 24 },
            { x: 280, y: 310, width: 200, height: 18 },
            { x: 680, y: 310, width: 200, height: 18 }
        ];

        const platforms = [];

        for (const data of platformData) {
            const platform = this.add.rectangle(
                data.x, data.y, data.width, data.height, 0x466478
            ).setStrokeStyle(2, 0x80c9eb);

            this.physics.add.existing(platform, true);
            platform.body.updateFromGameObject();

            // Colisión solamente desde arriba
            platform.body.checkCollision.down = false;
            platform.body.checkCollision.left = false;
            platform.body.checkCollision.right = false;

            platforms.push(platform);
        }

        // Controles configurados
        this.controls = loadGameSettings().controls;
        this.keysDown = new Set();

        const playerSpawns = {

            bolt: { x: 300, y: 350 },
            rivet: { x: 660, y: 350 }
        };

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

        // Colisiones con las plataformas
        for (const platform of platforms) {
            this.physics.add.collider(this.bolt, platform);
            this.physics.add.collider(this.rivet, platform);
        }

        
        // Dos armas por arena
        const weaponSpawns = [
            { x: 280, y: 265, type: 'spear' },
            { x: 680, y: 265, type: 'gloves' }
        ];

        // Mostrar el arma equipada por cada jugador
        this.weaponLabels = {
            bolt: this.add.text(90, 105, 'BOLT: Sin arma', {
                fontFamily: 'Arial',
                fontSize: '17px',
                color: '#38caff'
            }),

            rivet: this.add.text(690, 105, 'RIVET: Sin arma', {
                fontFamily: 'Arial',
                fontSize: '17px',
                color: '#ff5577'
            })
        };

        // Recogida automática
        const collectWeapon = (robot, pickup) => {
            if (!pickup.active) return;

            robot.equipWeapon(pickup.weaponType);

            this.weaponLabels[robot.robotName].setText(
                `${robot.robotName.toUpperCase()}: ${WEAPONS[robot.weaponType].label}`
            );

            // Desaparece y no puede volver a recogerse
            pickup.disableBody(true, true);
        };

        // Crear las armas en la arena
        for (const spawn of weaponSpawns) {
            const pickup = this.physics.add.staticImage(
                spawn.x,
                spawn.y,
                `weapon_${spawn.type}`
            );

            pickup.setScale(1);
            pickup.refreshBody();
            pickup.weaponType = spawn.type;
            this.weaponPickups.push(pickup);

            // Detectar contacto de cada robot con el arma
            this.physics.add.overlap(this.bolt, pickup, () => {
                collectWeapon(this.bolt, pickup);
            });

            this.physics.add.overlap(this.rivet, pickup, () => {
                collectWeapon(this.rivet, pickup);
            });
        }


        // Teclas utilizadas por los jugadores
        const usedKeys = new Set([
            ...Object.values(this.controls.bolt),
            ...Object.values(this.controls.rivet)
        ]);

        // Teclas pulsadas
        const onKeyDown = (event) => {

            if (!this.roundActive) return;
            if (!usedKeys.has(event.code)) return;

            event.preventDefault();
            this.keysDown.add(event.code);

            if (event.repeat) return;

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


    update(time, delta) {
        if (!this.roundActive) return;

        this.bolt.updateMovement(this.keysDown, delta);
        this.rivet.updateMovement(this.keysDown, delta);

        // Comprobar caídas
        const boltOut = this.bolt.y > 620;
        const rivetOut = this.rivet.y > 620;

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

            this.scoreText.setText(
                `BOLT ${this.scores.bolt} - ${this.scores.rivet} RIVET`
            );

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

            // Si hubo empate, repetimos el número de ronda
            if (advanceNumber) {
                this.roundNumber++;
            }

            // Restaurar jugadores
            this.bolt.respawn();
            this.rivet.respawn();

            // Restaurar armas recogidas
            for (const pickup of this.weaponPickups) {
                if (!pickup.active) {
                    pickup.enableBody(true, pickup.x, pickup.y, true, true);
                }
            }

            // Actualizar indicadores de armas
            this.weaponLabels.bolt.setText('BOLT: Sin arma');
            this.weaponLabels.rivet.setText('RIVET: Sin arma');

            // Actualizar ronda
            this.roundMessage.setText(`RONDA ${this.roundNumber}`);

            this.keysDown.clear();
            this.physics.resume();
            this.roundActive = true;
        }

}
