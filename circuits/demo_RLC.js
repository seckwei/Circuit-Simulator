const circuit = {
    components: [
        'V 1 0 5',
        'R 1 2 10',
        'C 2 3 1e-6',
        'L 3 0 1',
        'G 0 4',
    ],
    op: 'TR',
    probes: [
        'C V,I',
        '3'
    ]
};

export { circuit as default };