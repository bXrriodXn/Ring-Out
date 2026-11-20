
const ARENAS = [
    {
        id: 'training',
        name: 'ARENA DE ENTRENAMIENTO',
        fallLimit: 620,

        playerSpawns: {
            bolt: { x: 300, y: 350 },
            rivet: { x: 660, y: 350 }
        },

        platforms: [
            { x: 480, y: 445, width: 680, height: 24 },
            { x: 280, y: 310, width: 200, height: 18 },
            { x: 680, y: 310, width: 200, height: 18 }
        ],

        weaponSpawns: [
            { x: 280, y: 265, type: 'gloves' },
            { x: 680, y: 265, type: 'hammer' }
        ]

        
    },

    {
        id: 'walkway',
        name: 'PASARELA',
        fallLimit: 620,

        playerSpawns: {
            bolt: { x: 250, y: 350 },
            rivet: { x: 710, y: 350 }
        },

        platforms: [
            { x: 250, y: 445, width: 300, height: 24 },
            { x: 710, y: 445, width: 300, height: 24 },
            { x: 480, y: 340, width: 180, height: 18 }
        ],

        weaponSpawns: [
            { x: 350, y: 390, type: 'sword' },
            { x: 610, y: 390, type: 'spear' }
        ],

        spikes: [
            { x: 480, y: 527, width: 1008, height: 24 }
            
        ]
    }


];
