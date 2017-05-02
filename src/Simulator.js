// @flow
import fs from 'fs';

import Board from './Board';
import Traverser from './Traverser';
import Solver from './Solver';
import CircuitUpdater from './CircuitUpdater';
import SimConfig from '../src/SimulationConfig.js';
import { VoltageSource, CurrentSource, Wire, Inductor, Capacitor, Ground, Resistor } from './Components';

let max = SimConfig.maxIteration,
    fileData = '';

const B = new Board();

let V = new VoltageSource(5),
    I = new Inductor(10),
    R = new Resistor(10),
    C = new Capacitor(1e-6),
    GND = new Ground();

B.add(V, [[10,0], [10,10]]);
B.add(GND, [[10,10], [10,15]]);
B.add(R, [[10,0], [0,0]]);
B.add(C, [[0,0], [0,10]]);
B.add(I, [[0,10], [10,10]]);

let nodes = Traverser.assignComponentNodes(B.pins),
    solver = new Solver(SimConfig);

fs.writeFile('data.csv', '');

while(max--) {
    let solution = solver.solve(B.components, nodes);

    // Inductor V and I, Capacitor V and I
    fileData += `${C.dependant.V}, ${C.dependant.I}, ${I.dependant.V}, ${I.dependant.I}, ${C.pins[1].V}\n`;
    CircuitUpdater.update(CircuitUpdater.getUpdateObject(nodes, solution));
}

fs.appendFile('data.csv', fileData);

/**
 * Simulator.board  // Pre initialised Board
 * 
 * // Simulation Configuration, initially pulled in from SimulationConfig
 * Simulator.config
 * Simulator.config.setTimestep()
 * 
 * Simulator.start()
 * Simulator.pause()
 * Simulator.reset()
 */