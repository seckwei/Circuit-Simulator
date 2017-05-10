import Board from './Board';
import { VoltageSource, CurrentSource, Wire, Inductor, Capacitor, Ground, Resistor } from './Components';

export function Builder(circuit) {
    let obj = {
        board: new Board(),
        components: {},
        probes: [],
        readProbes() {
            let result = [];
            obj.probes.forEach(probe => {
                result.push(`${probe[0][probe[1]]}`);
            });
            return result.join(',');
        }
    };

    circuit.components.forEach(entry => {
        let [id, pos1, pos2, val] = entry.split(' '),
            component;

        pos1 = parseInt(pos1);
        pos2 = parseInt(pos2);
        val = parseFloat(val);

        switch (id.toUpperCase()) {
            case 'V': component = new VoltageSource(val); break;
            case 'R': component = new Resistor(val); break;
            case 'C': component = new Capacitor(val); break;
            case 'L': component = new Inductor(val); break;
            case 'W': component = new Wire(); break;
            case 'GND': component = new Ground(); break;
            default: throw new Error('No such component symbol!');
        }

        obj.components[id] = obj.board.add(component, [pos1, pos2]);
    });

    circuit.probes.forEach(entry => {
        let [id, symbols] = entry.split(' ');

        if (Number.isInteger(parseInt(id))) {
            let nodeNum = parseInt(id),
                pin = obj.board.grid[nodeNum][0];

            obj.probes.push([pin, 'V']);
        }
        else {
            symbols = symbols.split(',');
            symbols.forEach(symbol => {
                obj.probes.push([obj.board.components[obj.components[id]].dependant, symbol]);
            });
        }
    });

    return obj;
};