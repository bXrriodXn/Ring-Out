

const ARENAS = [
    {
        id: 'training',
        name: 'ENTRENAMIENTO',
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
            { x: 280, y: 265 },
            { x: 680, y: 265 }
        ]

        
    },

    {
        id: 'walkway',
        name: 'PASARELA',
        fallLimit: 620,

        playerSpawns: {
            bolt: { x: 50, y: 240 },
            rivet: { x: 910, y: 240 }
        },

        platforms: [
            { x: 50, y: 400, width: 100, height: 18 },
            { x: 910, y: 400, width: 100, height: 18 },


            // Centrales
            { x: 480, y: 200, width: 180, height: 18 },

            { x: 480, y: 300, width: 180, height: 18 },

            { x: 480, y: 400, width: 180, height: 18 },



            //Chiquitinas
            { x: 150, y: 400, width: 40, height: 10 },
            { x: 250, y: 400, width: 40, height: 10 },
            { x: 350, y: 400, width: 40, height: 10 },
            


            { x: 610, y: 400, width: 40, height: 10 },
            { x: 710, y: 400, width: 40, height: 10 },
            { x: 810, y: 400, width: 40, height: 10 },
            
        ],

        weaponSpawns: [
            { x: 450, y: 150},
            { x: 500, y: 150}
        ],

        spikes: [
            { x: 480, y: 530, width: 1008, height: 24 }
            
        ]
    }


];
