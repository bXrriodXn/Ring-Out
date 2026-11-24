
class SettingsScene extends Phaser.Scene {

    constructor() {
        super('SettingsScene');
    }

    create() {


        const settings = loadGameSettings();
        this.sound.volume = settings.volume;

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
        0.5
        ).setDepth(-0.5);
        this.add.text(480, 45, 'AJUSTES', {
            fontFamily: 'Arial',
            fontSize: '36px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const status = this.add.text(480, 445, '', {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#ffcc66'
        }).setOrigin(0.5);

        // Función reutilizable para crear botones
        const createButton = (x, y, w, h, label, callback) => {
            const background = this.add.rectangle(
                x, y, w, h, 0x263e52
            ).setStrokeStyle(2, 0x5aa5ce);

            const text = this.add.text(x, y, label, {
                fontFamily: 'Arial',
                fontSize: '16px',
                color: '#ffffff'
            }).setOrigin(0.5);

            background.setInteractive({ useHandCursor: true });

            background.on('pointerover', () => {
                background.setFillStyle(0x3b6481);
            });

            background.on('pointerout', () => {
                background.setFillStyle(0x263e52);
            });

            background.on('pointerdown', callback);

            return { background, text };
        };

        const save = () => {
            if (!saveGameSettings(settings)) {
                status.setText('Error al guardar los ajustes');
                return false;
            }
            return true;
        };

        // VOLUMEN
        this.add.text(350, 115, 'VOLUMEN GENERAL', {
            fontFamily: 'Arial',
            fontSize: '19px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const volumeText = this.add.text(
            505, 115, `${Math.round(settings.volume * 100)}%`,
            { fontFamily: 'Arial', fontSize: '20px', color: '#66ccff' }
        ).setOrigin(0.5);

        const changeVolume = (amount) => {
            settings.volume = Math.round(
                Math.max(0, Math.min(1, settings.volume + amount)) * 10
            ) / 10;

            this.sound.volume = settings.volume;
            volumeText.setText(`${Math.round(settings.volume * 100)}%`);

            if (save()) status.setText('Volumen guardado');
        };

        createButton(595, 115, 45, 38, '-', () => changeVolume(-0.1));
        createButton(655, 115, 45, 38, '+', () => changeVolume(0.1));

        // CONTROLES
        const actions = [
            { key: 'left', label: 'Izquierda' },
            { key: 'right', label: 'Derecha' },
            { key: 'jump', label: 'Saltar' },
            { key: 'attack', label: 'Atacar' },
            { key: 'pause', label: 'Pausar' }
        ];

        const players = [
            { key: 'bolt', name: 'BOLT', x: 75, color: '#38caff' },
            { key: 'rivet', name: 'RIVET', x: 525, color: '#ff5577' }
        ];

        let pending = null;
        const controlButtons = [];

        for (const player of players) {

            this.add.text(player.x + 180, 180, player.name, {
                fontFamily: 'Arial',
                fontSize: '25px',
                color: player.color
            }).setOrigin(0.5);

            actions.forEach((action, index) => {
                const y = 225 + index * 40;

                this.add.text(player.x, y, action.label, {
                    fontFamily: 'Arial',
                    fontSize: '17px',
                    color: '#ffffff'
                }).setOrigin(0, 0.5);

                const control = createButton(
                    player.x + 270, y, 155, 32,
                    keyLabel(settings.controls[player.key][action.key]),
                    () => {
                        if (pending) {
                            pending.text.setText(
                                keyLabel(
                                    settings.controls[pending.player][pending.action]
                                )
                            );
                        }

                        pending = {
                            player: player.key,
                            action: action.key,
                            text: control.text
                        };

                        control.text.setText('...');
                        status.setText('Pulsa una tecla (Retroceso cancela)');
                    }
                );

                controlButtons.push({
                    player: player.key,
                    action: action.key,
                    text: control.text
                });
            });
        }

        // CAPTURAR LA NUEVA TECLA
        const onKeyDown = (event) => {
            if (!pending || event.repeat) return;

            event.preventDefault();

            if (event.code === 'Backspace') {
                pending.text.setText(
                    keyLabel(
                        settings.controls[pending.player][pending.action]
                    )
                );

                pending = null;
                status.setText('Cambio cancelado');
                return;
            }

            if (!isAssignableKey(event.code)) {
                status.setText('Tecla no permitida');
                return;
            }

            // Evitar teclas duplicadas
            const duplicated = players.some(player =>
                actions.some(action =>
                    settings.controls[player.key][action.key] === event.code &&
                    !(player.key === pending.player &&
                      action.key === pending.action)
                )
            );

            if (duplicated) {
                status.setText('La tecla ya esta asignada');
                return;
            }

            settings.controls[pending.player][pending.action] = event.code;

            pending.text.setText(keyLabel(event.code));
            pending = null;

            if (save()) status.setText('Control guardado');
        };

        this.input.keyboard.on('keydown', onKeyDown);

        // Retirar el evento cuando abandonamos la escena
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.input.keyboard.off('keydown', onKeyDown);
        });

        // RESTABLECER
        createButton(345, 505, 230, 42, 'RESTABLECER', () => {

            this.sound.play('sfxClick', { volume: 0.7 });

            const defaults = defaultGameSettings();


            settings.volume = defaults.volume;
            settings.controls = defaults.controls;

            this.sound.volume = settings.volume;
            volumeText.setText(`${Math.round(settings.volume * 100)}%`);

            for (const control of controlButtons) {
                control.text.setText(
                    keyLabel(settings.controls[control.player][control.action])
                );
            }

            pending = null;

            if (save()) status.setText('Valores restablecidos');
        });

        // VOLVER AL MENU
        createButton(615, 505, 230, 42, 'VOLVER AL MENU', () => {
            this.sound.play('sfxBack', { volume: 0.6 });
            this.scene.start('MenuScene');
        });
    }
}
