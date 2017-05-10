const circuit = {
    components: [
        'V 1 0 5',
        'W1 1 2',
        'W2 2 3',
        'W3 3 4',
        'W4 5 6',
        'W5 6 7',
        'W6 8 9',
        'W7 9 10',
        'W8 6 9',
        'W9 11 12',
        'W10 12 13',
        'W11 0 11',
        'R1 2 5 100',
        'R2 3 6 200',
        'R3 4 7 300',
        'R4 8 11 400',
        'R5 9 12 500',
        'R6 10 13 600',
        'G 0 14',
    ],
    op: 'DC',
    probes: [
        '1',
        '6',
        'R1 V,I',
        'R2 V,I',
        'R3 V,I'
    ]
};

export { circuit as default };