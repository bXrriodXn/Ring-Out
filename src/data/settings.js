
const SETTINGS_KEY = 'ringout-settings-v1';

const DEFAULT_SETTINGS = {
    volume: 0.6,

    controls: {
        bolt: {
            left: 'KeyA',
            right: 'KeyD',
            jump: 'KeyW',
            attack: 'Space',
            pause: 'Escape'
        },

        rivet: {
            left: 'ArrowLeft',
            right: 'ArrowRight',
            jump: 'ArrowUp',
            attack: 'Enter',
            pause: 'KeyP'
        }
    }
};

// Crear una copia independiente de los valores iniciales
function defaultGameSettings() {
    return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
}

// Comprobar si aceptamos una tecla para jugar
function isAssignableKey(code) {
    return /^(Key[A-Z]|Digit[0-9]|Arrow(Up|Down|Left|Right)|Space|Enter|Escape)$/.test(code);
}

// Mostrar nombres legibles
function keyLabel(code) {
    const labels = {
        Space: 'Espacio',
        Enter: 'Intro',
        Escape: 'Esc',
        ArrowLeft: '←',
        ArrowRight: '→',
        ArrowUp: '↑',
        ArrowDown: '↓'
    };

    return labels[code] || code.replace(/^Key/, '').replace(/^Digit/, '');
}

// Recuperar ajustes
function loadGameSettings() {
    const settings = defaultGameSettings();

    try {
        const raw = localStorage.getItem(SETTINGS_KEY);
        if (!raw) return settings;

        const saved = JSON.parse(raw);

        if (typeof saved.volume === 'number' &&
            Number.isFinite(saved.volume)) {
            settings.volume = Math.max(0, Math.min(1, saved.volume));
        }

        for (const player of ['bolt', 'rivet']) {
            for (const action of Object.keys(settings.controls[player])) {
                const code = saved.controls?.[player]?.[action];

                if (typeof code === 'string' && isAssignableKey(code)) {
                    settings.controls[player][action] = code;
                }
            }
        }

    } catch (error) {
        console.warn('No se pudieron cargar los ajustes:', error);
    }

    return settings;
}

// Guardar ajustes
function saveGameSettings(settings) {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        return true;

    } catch (error) {
        console.warn('No se pudieron guardar los ajustes:', error);
        return false;
    }
}
