// @flow
import fs from 'fs';

import Board from './Board';
import Traverser from './Traverser';
import Solver from './Solver';
import CircuitUpdater from './CircuitUpdater';
import SimConfig from '../src/SimulationConfig.js';
import { VoltageSource, CurrentSource, Wire, Inductor, Capacitor, Ground, Resistor } from './Components';

let max = 2000;

const B = new Board();

let V = new VoltageSource(5),
    W = new Capacitor(1e-6),
    R = new Resistor(10),
    C = new Inductor(10),
    GND = new Ground();

B.add(V, [[10,0], [10,10]]);
B.add(GND, [[10,10], [10,15]]);
B.add(R, [[10,0], [0,0]]);
B.add(W, [[0,0], [0,10]]);
B.add(C, [[0,10], [10,10]]);

let nodes = Traverser.assignComponentNodes(B.pins),
    solver = new Solver(SimConfig);

fs.writeFile('data.csv', '');

while(max--) {
    let solution = solver.solve(B.pins, nodes);

    fs.appendFile('data.csv', `${C.dependant.V}, ${C.dependant.I}\n`);
    CircuitUpdater.update(CircuitUpdater.getUpdateObject(nodes, solution));
}