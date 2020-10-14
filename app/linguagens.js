LINGUAGENS = {
    'A': {
        definicao: 'possui aa ou bb como subpalavra',
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
    'B': {
        definicao: 'começa e termina com x ou começa e termina com y',
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
    'male': {
        definicao: 'a palavra malemolência com ou sem acento',
        automato: Automato.criar(
            // Gera uma lista com as letras de malêemolencia
            [ ...'malemolêencia' ],
            {
                q0: { m: 'q1' },
                q1: { a: 'q2' },
                q2: { l: 'q3' },
                q3: { e: 'q4' },
                q4: { m: 'q5' },
                q5: { o: 'q6' },
                q6: { l: 'q7' },
                q7: { 'ê': 'q8', e: 'q8' },
                q8: { n: 'q9' },
                q9: { c: 'q10' },
                q10: { i: 'q11' },
                q11: { a: 'qf' },
                qf: {}
            },
            [ 'qf' ],
            'q0'
        )
    },
    'natu': {
        definicao: 'números naturais, incluindo o zero, porém sem zeros a esquerda',
        automato: Automato.criar(
            // Gera uma lista com caracteres '0', '1', ..., '9'
            Array(10).fill().map((_, i) => ''+i),
            {
                q0: {
                    '1': 'qf1', '2': 'qf1', '3': 'qf1', '4': 'qf1', '5': 'qf1',
                    '6': 'qf1', '7': 'qf1', '8': 'qf1', '9': 'qf1', '0': 'qf0'
                },
                qf1: {
                    '1': 'qf1', '2': 'qf1', '3': 'qf1', '4': 'qf1', '5': 'qf1',
                    '6': 'qf1', '7': 'qf1', '8': 'qf1', '9': 'qf1', '0': 'qf1'
                },
                qf0: {}
            },
            [ 'qf1', 'qf0' ],
            'q0'
        )
    }
};
