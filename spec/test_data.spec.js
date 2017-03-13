const VoltageSource = require('../src/VoltageSource.js'),
    CurrentSource = require('../src/CurrentSource.js'),
    Resistor = require('../src/Resistor.js'),
    Wire = require('../src/Wire.js'),
    Ground = require('../src/Ground.js'); 

const I0 = new CurrentSource(5),
    G1 = new Ground(),          
    W2 = new Wire(),            
    W3 = new Wire(),            
    R4 = new Resistor(2),       
    R5 = new Resistor(4),       
    R6 = new Resistor(6),       
    R7 = new Resistor(8);       

const N0 = [0,10],
    N1 = [ 0, 0],
    N2 = [10, 0],
    N3 = [20, 0],
    N4 = [20,10],
    N5 = [10,10];

I0.place([N0, N1]);
G1.place([N0, [0,20]]);
W2.place([N1, N2]);
R5.place([N2, N3]);
R6.place([N3, N4]);
W3.place([N4, N5]);
R7.place([N5, N0]);
R4.place([N2, N5]);

I0.nodes = [0,1];
W2.nodes = [1,2];
R5.nodes = [2,3];
R6.nodes = [3,4];
W3.nodes = [4,5];
R7.nodes = [5,0];
R4.nodes = [2,5];
G1.nodes = [0];

const WORKING_CIRCUIT = {

    pins: {
        [N0.toString()]: [
            I0.pins[0],
            G1.pins[0],
            R7.pins[1]
        ],

        [N1.toString()]: [
            I0.pins[1],
            W2.pins[0]
        ],

        [N2.toString()]: [
            W2.pins[1],
            R4.pins[0],
            R5.pins[0]
        ],

        [N3.toString()]: [
            R5.pins[1],
            R6.pins[0]
        ],

        [N4.toString()]: [
            R6.pins[1],
            W3.pins[0]
        ],

        [N5.toString()]: [
            R4.pins[1],
            W3.pins[1],
            R7.pins[0]
        ]
    },

    nodes_prearranged: [
        [],
        [
            I0.pins[0],
            G1.pins[0],
            R7.pins[1]
        ],
        [
            I0.pins[1],
            W2.pins[0]
        ],
        [
            W2.pins[1],
            R4.pins[0],
            R5.pins[0]
        ],
        [
            R5.pins[1],
            R6.pins[0]
        ],
        [
            R6.pins[1],
            W3.pins[0]
        ],
        [
            R4.pins[1],
            W3.pins[1],
            R7.pins[0]
        ]
    ],

    nodes_arranged: [
        // 0
        [
            I0.pins[0],
            G1.pins[0],
            R7.pins[1]
        ],
        // 1
        [
            I0.pins[1],
            W2.pins[0]
        ],
        // 2
        [
            W2.pins[1],
            R4.pins[0],
            R5.pins[0]
        ],
        // 3
        [
            R5.pins[1],
            R6.pins[0]
        ],
        // 4
        [
            R6.pins[1],
            W3.pins[0]
        ],
        // 5
        [
            R4.pins[1],
            W3.pins[1],
            R7.pins[0]
        ]
    ],

    solution: [0, 48.33, 48.33, 45, 40, 40, 5, 0.83333],

    updateObj: {
        I0: {
            component: I0,
            value: {
                pins: [0,48.33]
            }
        },
        W2: {
            component: W2,
            value: {
                I: 5,
                pins: [48.33,48.33]
            }
        },
        W3: {
            component: W3,
            value: {
                I: 0.83333,
                pins: [40,40]
            }
        },
        R4: {
            component: R4,
            value: {
                pins: [48.33,40]
            }
        },
        R5: {
            component: R5,
            value: {
                pins: [48.33,45]
            }
        },
        R6: {
            component: R6,
            value: {
                pins: [45,40]
            }
        },
        R7: {
            component: R7,
            value: {
                pins: [40,0]
            }
        }
    }
};

module.exports.WORKING_CIRCUIT = WORKING_CIRCUIT;