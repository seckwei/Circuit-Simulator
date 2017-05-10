// @flow
import fs from 'fs';

import Traverser from './Traverser';
import Solver from './Solver';
import CircuitUpdater from './CircuitUpdater';
import SimConfig from './SimulationConfig';
import { Builder } from './Builder';

import circuit from '../circuits/demo_R';

let maxIterations = SimConfig.maxTime / SimConfig.timestep,
    time = 0,
    solution = [];

// References to circuit and probes
let circuitObj = Builder(circuit),
    probeNum = circuitObj.probeTitles.length,
    probeData = [],
    probeResults;

for (let i = 0; i < probeNum; ++i) {
    probeData[i] = [];
}

// Simulation starts here
let nodes = Traverser.assignComponentNodes(circuitObj.board.pins),
    solver = new Solver(SimConfig);

// Transient Analysis
if (circuitObj.op === 'TR') {
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
    fs.writeFile('./pub/data/result_RLC.js', `
        const titles = [${circuitObj.probeTitles}];
        const results = ${JSON.stringify(probeData)};
    `);
}
// DC analysis
else if (circuitObj.op === 'DC') {
    solution = solver.solve(circuitObj.board.components, nodes);
    CircuitUpdater.update(CircuitUpdater.getUpdateObject(nodes, solution));

    console.log(circuitObj.probeTitles);
    console.log(circuitObj.readProbes());
}