import Board from '../src/Board';
import { VoltageSource, CurrentSource, Wire, Inductor, Capacitor, Ground, Resistor } from '../src/Components';

const B = new Board();

const components = {
    V : new VoltageSource(5),
    L : new Inductor(1),
    R : new Resistor(10),
    C : new Capacitor(1e-6),
    GND : new Ground()
};

B.add(components.V, [1, 0]);
B.add(components.GND, [0, 4]);
B.add(components.R, [1, 2]);
B.add(components.C, [2, 3]);
B.add(components.L, [3, 0]);

const circuit = { board: B, components: components };

export { circuit as default };