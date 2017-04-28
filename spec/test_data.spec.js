import Board from '../src/Board';
import { VoltageSource, CurrentSource, Wire, Resistor, Ground } from '../src/Components';

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

const B = new Board();

B.add(I0, [N0, N1]);
B.add(G1, [N0, [0,20]]);
B.add(W2, [N1, N2]);
B.add(R5, [N2, N3]);
B.add(R6, [N3, N4]);
B.add(W3, [N4, N5]);
B.add(R7, [N5, N0]);
B.add(R4, [N2, N5]);

I0.nodes = [0,1];
W2.nodes = [1,2];
R5.nodes = [2,3];
R6.nodes = [3,4];
W3.nodes = [4,5];
R7.nodes = [5,0];
R4.nodes = [2,5];
G1.nodes = [0];

W2.vSourceNum = 1;
W3.vSourceNum = 2;

const WORKING_CIRCUIT = {

    components: B.components,

    pins: B.pins,

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

    updateObject: {
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

export {WORKING_CIRCUIT as default};