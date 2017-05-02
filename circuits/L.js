import Board from '../src/Board';
import { VoltageSource, CurrentSource, Wire, Inductor, Capacitor, Ground, Resistor } from '../src/Components';

const B = new Board();

const components = {
    V : new VoltageSource(5),
    W : new Wire(),
    R : new Resistor(1000),
    L : new Inductor(10),
    GND : new Ground()
};

B.add(components.V, [[10,0], [10,10]]);
B.add(components.GND, [[10,10], [10,15]]);
B.add(components.R, [[10,0], [0,0]]);
B.add(components.L, [[0,0], [0,10]]);
B.add(components.W, [[0,10], [10,10]]);

const circuit = { board: B, components: components };

export { circuit as default };