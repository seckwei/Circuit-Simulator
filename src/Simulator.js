// @flow
import fs from 'fs';

import Traverser from './Traverser';
import Solver from './Solver';
import CircuitUpdater from './CircuitUpdater';
import SimConfig from './SimulationConfig';
import { Builder } from './Builder';

import RLC_circuit from '../circuits/demo_RLC';

let maxIterations = SimConfig.maxTime / SimConfig.timestep,
    time = 0,
    fileData = '',
    solution = [];

// Save references for later use
let circuitObj = Builder(RLC_circuit);

// Simulation starts here
let nodes = Traverser.assignComponentNodes(circuitObj.board.pins),
    solver = new Solver(SimConfig);

while (maxIterations--) {
    solution = solver.solve(circuitObj.board.components, nodes);

    // Store all the data first, then execute only one file write later
    fileData += `${time},${circuitObj.readProbes()}\n`;

    CircuitUpdater.update(CircuitUpdater.getUpdateObject(nodes, solution));

    time += SimConfig.timestep;
}

//console.log(fileData);
fs.writeFile('demo_RLC.csv', fileData);