// @flow
import fs from 'fs';

import Board from './Board';
import Traverser from './Traverser';
import Solver from './Solver';
import CircuitUpdater from './CircuitUpdater';
import SimConfig from './SimulationConfig';
import { VoltageSource, CurrentSource, Wire, Inductor, Capacitor, Ground, Resistor } from './Components';

import RLC_circuit from '../circuits/RLC';

let maxIterations = SimConfig.maxTime / SimConfig.timestep,
    time = 0,
    fileData = '',
    solution = [];

// Save references for later use
let B = RLC_circuit.board,
    C = RLC_circuit.components.C;

// Simulation starts here
let nodes = Traverser.assignComponentNodes(B.pins),
    solver = new Solver(SimConfig);

while(maxIterations--) {
    solution = solver.solve(B.components, nodes);

    // Store all the data first, then execute only one file write later
    fileData += `${time}, ${C.dependant.I}, ${C.dependant.V}\n`;

    CircuitUpdater.update(CircuitUpdater.getUpdateObject(nodes, solution));
    
    time += SimConfig.timestep;
}

fs.writeFile('RLC.csv', fileData);