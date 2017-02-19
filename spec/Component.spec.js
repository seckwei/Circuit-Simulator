const Component = require('../src/Component.js');

describe('Component Module', () => {

    describe('constructor', () => {
        it('should throw error if this class is instantiated', () => {
            expect(() => { new Component(); })
            .toThrowError(TypeError, 'Unable to instantiate abstract Component class');
        });
    });

});