const VoltageSource = require('../src/VoltageSource.js'),
    CurrentSource = require('../src/CurrentSource.js'),
    Resistor = require('../src/Resistor.js'),
    Wire = require('../src/Wire.js'),
    Ground = require('../src/Ground.js'); 

const I1 = new CurrentSource(5),
    GND = new Ground(),
    W1 = new Wire(),
    W2 = new Wire(),
    R1 = new Resistor(2),
    R2 = new Resistor(4),
    R3 = new Resistor(6),
    R4 = new Resistor(8);

const N0 = [0,10],
    N1 = [ 0, 0],
    N2 = [10, 0],
    N3 = [20, 0],
    N4 = [20,10],
    N5 = [10,10];

I1.place([N0, N1]);
GND.place([N0, [0,20]]);
W1.place([N1, N2]);
R2.place([N2, N3]);
R3.place([N3, N4]);
W2.place([N4, N5]);
R4.place([N5, N0]);
R1.place([N2, N5]);

I1.nodes = [0,1];
W1.nodes = [1,2];
R2.nodes = [2,3];
R3.nodes = [3,4];
W2.nodes = [4,5];
R4.nodes = [5,0];
R1.nodes = [2,5];
GND.nodes = [0];

const WORKING_CIRCUIT = {

    components: {
        [N0.toString()]: [
            I1.pins[0],
            GND.pins[0],
            R4.pins[1]
        ],

        [N1.toString()]: [
            I1.pins[1],
            W1.pins[0]
        ],

        [N2.toString()]: [
            W1.pins[1],
            R1.pins[0],
            R2.pins[0]
        ],

        [N3.toString()]: [
            R2.pins[1],
            R3.pins[0]
        ],

        [N4.toString()]: [
            R3.pins[1],
            W2.pins[0]
        ],

        [N5.toString()]: [
            R1.pins[1],
            W2.pins[1],
            R4.pins[0]
        ]
    },

    nodes_prearranged: [
        [],
        [
            I1.pins[0],
            GND.pins[0],
            R4.pins[1]
        ],
        [
            I1.pins[1],
            W1.pins[0]
        ],
        [
            W1.pins[1],
            R1.pins[0],
            R2.pins[0]
        ],
        [
            R2.pins[1],
            R3.pins[0]
        ],
        [
            R3.pins[1],
            W2.pins[0]
        ],
        [
            R1.pins[1],
            W2.pins[1],
            R4.pins[0]
        ]
    ],

    nodes_arranged: [
        // 0
        [
            I1.pins[0],
            GND.pins[0],
            R4.pins[1]
        ],
        // 1
        [
            I1.pins[1],
            W1.pins[0]
        ],
        // 2
        [
            W1.pins[1],
            R1.pins[0],
            R2.pins[0]
        ],
        // 3
        [
            R2.pins[1],
            R3.pins[0]
        ],
        // 4
        [
            R3.pins[1],
            W2.pins[0]
        ],
        // 5
        [
            R1.pins[1],
            W2.pins[1],
            R4.pins[0]
        ]
    ],

    solution: [0, 48.33, 48.33, 45, 40, 40, 5, 5]
};

let componentDict: {string: Component} = {};
for(let pos in WORKING_CIRCUIT.components) {
    WORKING_CIRCUIT.components[pos].forEach(pin => {
        componentDict[pin.parent.id] = pin.parent;
    });
}

WORKING_CIRCUIT.componentDict = componentDict;

module.exports.WORKING_CIRCUIT = WORKING_CIRCUIT;