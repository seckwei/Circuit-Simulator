const circuit = {
    components: [
        'V 1 0 5',
        'R 1 2 10',
        'C 2 3 1e-6',
        'L 3 0 1',
        'R2 2 4 5',
        'L2 4 5 2',
        'C2 5 3 2e-6',
        'G 0 6'
    ],
    op: 'TR',
    probes: [
        'L V,I',
        'C V,I',
        'L2 V,I',
        'C2 V,I'
    ]
};

export { circuit as default };