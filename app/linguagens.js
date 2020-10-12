LINGUAGENS = {
    A: {
        definicao: 'w | w possui aa ou bb como subpalavra',
        automato: Automato.criar(
            [ 'a', 'b' ],
            {
                q0: { a: 'q1', b: 'q2' },
                q1: { a: 'qf', b: 'q2' },
                q2: { a: 'q1', b: 'qf' },
                qf: { a: 'qf', b: 'qf' }
            },
            [ 'qf' ],
            'q0'
        )
    },
    B: {
        definicao: 'w | w termina com 0 e |w|>=3',
        automato: Automato.criar(
            [ '0', '1' ],
            {
                q0: { '0': 'q1', '1': 'q1' },
                q1: { '0': 'q2', '1': 'q2' },
                q2: { '0': 'qf', '1': 'q3' },
                q3: { '0': 'qf', '1': 'q3' },
                qf: { '0': 'qf', '1': 'q3' }
            },
            [ 'qf' ],
            'q0'
        )
    },
    C: {
        definicao: 'w | w começa e termina com x ou começa e termina com y',
        automato: Automato.criar(
            [ 'x', 'y' ],
            {
                q0: { x: 'qfx', y: 'qfy' },
                q1: { x: 'qfx', y: 'q1' },
                q2: { x: 'q2', y: 'qfy' },
                qfx: { x: 'qfx', y: 'q1' },
                qfy: { x: 'q2', y: 'qfy' },
            },
            [ 'qfx', 'qfy' ],
            'q0'
        )
    },
    D: {
        definicao: 'w | w possui cba como subpalavra',
        automato: Automato.criar(
            [ 'a', 'b', 'c' ],
            {
                q0: { a: 'q0', b: 'q0', c: 'q1' },
                q1: { a: 'q0', b: 'q2', c: 'q1' },
                q2: { a: 'qf', b: 'q0', c: 'q1' },
                qf: { a: 'qf', b: 'qf', c: 'qf' }
            },
            [ 'qf' ],
            'q0'
        )
    },
};
