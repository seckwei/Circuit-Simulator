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
    solution = [];

// Save references for later use
let circuitObj = Builder(RLC_circuit),
    probeNum = circuitObj.probeTitles.length,
    probeData = [],
    probeResults;

for (let i = 0; i < probeNum; ++i) {
    probeData[i] = [];
}

// Simulation starts here
let nodes = Traverser.assignComponentNodes(circuitObj.board.pins),
    solver = new Solver(SimConfig);

while (maxIterations--) {
    solution = solver.solve(circuitObj.board.components, nodes);

    probeResults = circuitObj.readProbes();
    for (let i = 0; i < probeNum; ++i) {
        probeData[i].push([time, probeResults[i]]);
    }

    CircuitUpdater.update(CircuitUpdater.getUpdateObject(nodes, solution));
    time += SimConfig.timestep;
}

//console.log(probeData.length, probeData[0].length);
fs.writeFile('result_RLC.js', `
    const titles = [${circuitObj.probeTitles}];
    const results = ${JSON.stringify(probeData)};
`);