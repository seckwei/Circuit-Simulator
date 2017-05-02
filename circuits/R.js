import Board from '../src/Board';
import { VoltageSource, CurrentSource, Wire, Inductor, Capacitor, Ground, Resistor } from '../src/Components';

const B = new Board();

const components = {
    V1 : new VoltageSource(5),
    W1 : new Wire(),
    W2 : new Wire(),
    W3 : new Wire(),
    W4 : new Wire(),
    W5 : new Wire(),
    W6 : new Wire(),
    W7 : new Wire(),
    W8 : new Wire(),
    W9 : new Wire(),
    W10 : new Wire(),
    W11 : new Wire(),
    R1 : new Resistor(100),
    R2 : new Resistor(200),
    R3 : new Resistor(300),
    R4 : new Resistor(400),
    R5 : new Resistor(500),
    R6 : new Resistor(600),
    GND : new Ground()
};

const p1 = [0,0],
    p2 = [2,0],
    p3 = [4,0],
    p4 = [6,0],

    p5 = [2,2],
    p6 = [4,2],
    p7 = [6,2],

    p8 = [2,4],
    p9 = [4,4],
    p10 = [6,4],

    p11 = [2,6],
    p12 = [4,6],
    p13 = [6,6],

    p14 = [0,6],
    p15 = [0,8];

B.add(components.V1, [p1, p14]);
B.add(components.W1, [p1, p2]);
B.add(components.W2, [p2, p3]);
B.add(components.W3, [p3, p4]);
B.add(components.W4, [p5, p6]);
B.add(components.W5, [p6, p7]);
B.add(components.W6, [p8, p9]);
B.add(components.W7, [p9, p10]);
B.add(components.W8, [p6, p9]); // Bridge
B.add(components.W9, [p11, p12]);
B.add(components.W10, [p12, p13]);
B.add(components.W11, [p14, p11]);
B.add(components.R1, [p2, p5]);
B.add(components.R2, [p3, p6]);
B.add(components.R3, [p4, p7]);
B.add(components.R4, [p8, p11]);
B.add(components.R5, [p9, p12]);
B.add(components.R6, [p10, p13]);
B.add(components.GND, [p14, p15]);

const circuit = { board: B, components: components };

export { circuit as default };