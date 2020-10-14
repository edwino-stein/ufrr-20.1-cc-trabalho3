const tape = require('tape');
const Automato = require('../src/Automato');

tape('Verificar o construtor', (t) => {

    t.ok(
        new Automato() instanceof Automato,
        'Deve permitir contruir um objeto padrão'
    );

    t.throws(
        () => Automato.criar(),
        (e) => e === 'Alfabeto deve ser uma lista de símbolos',
        'Deve ocorrer erro por causa da lista de símbolos do alfabeto'
    );

    t.throws(
        () => Automato.criar(['a', 'b']),
        (e) => e === 'Estados devem ser um objeto chave-valor',
        'Deve ocorrer erro por causa da lista de estados'
    );

    t.throws(
        () => Automato.criar(['a', 'b'], { q0: { a: 'q0', b: 'q0' } }),
        (e) => e === 'Estados finais deve ser uma lista de de estados',
        'Deve ocorrer erro por causa da lista de estados finais'
    );

    t.throws(
        () => Automato.criar(['a', 'b'], { q0: { a: 'q0', b: 'q0' } }, [ 'q0' ]),
        (e) => e === 'O estado inicial deve ser o nome de um estado válido',
        'Deve ocorrer erro por causa do estado inicial'
    );

    t.doesNotThrow(
        () => Automato.criar(
            ['a', 'b'],
            { q0: { a: 'q0', b: 'q0' } },
            [ 'q0' ],
            'q0'
        ),
        'Não deve ocorrer erro com todos parâmetros válidos'
    );

    const automato = Automato.criar(
        ['a', 'b'],
        { q0: { a: 'q0', b: 'q0' } },
        [ 'q0' ],
        'q0'
    );

    t.ok(
        automato instanceof Automato,
        'Deve contruir uma instância de Automato'
    );

    t.deepEqual(
        automato.alfabeto,
        [ 'a', 'b' ],
        'Os símbulos do alfabeto devem ser "a" e "b"'
    );

    t.equals(automato.estados.length, 1, 'Deve conter um estado');
    t.equals(automato.finais.length, 1, 'Deve conter um estado final');


    t.doesNotThrow(
        () => automato.estado('q0'),
        'O Estado "q0" tem que existir no automato'
    );

    t.equals(
        automato.inicial.nome,
        'q0',
        'O estado inicial deve ser o "q0"'
    );

    t.equals(
        automato.finais[0],
        automato.inicial,
        'O estado final e inicial devem ser o mesmo'
    );

    t.equals(
        automato.estado('q0').proximo('a').nome,
        'q0',
        'Do Estado "q0" com entrada "a" deve ir para "q0"'
    );

    t.equals(
        automato.estado('q0').proximo('b').nome,
        'q0',
        'Do Estado "q0" com entrada "b" deve ir para "q0"'
    );

    t.end();
});

tape('Verificar a linguagem L = { w | w possui aa ou bb como subpalavra }', (t) => {

    const automato = Automato.criar(
        [ 'a', 'b' ],
        {
            q0: { a: 'q1', b: 'q2' },
            q1: { a: 'qf', b: 'q2' },
            q2: { a: 'q1', b: 'qf' },
            qf: { a: 'qf', b: 'qf' }
        },
        [ 'qf' ],
        'q0'
    );

    t.ok(automato.verificar('aa'), 'Deve aceitar "aa"')
    t.ok(automato.verificar('bb'), 'Deve aceitar "bb"')
    t.notOk(automato.verificar('baba'), 'Não deve aceitar "baba"')
    t.notOk(automato.verificar('abab'), 'Não deve aceitar "baba"')
    t.ok(automato.verificar('aabb'), 'Deve aceitar "aabb"')

    t.end();
});

tape('Verificar a linguagem L = { w | w é a palavra malemolência com ou sem acento }', (t) => {

    const automato = Automato.criar(
        // Gera uma lista com as letras de malêemolencia
        [...'malemolêencia'],
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
    );

    t.ok(automato.verificar('malemolência'), 'Deve aceitar "malemolência"');
    t.ok(automato.verificar('malemolencia'), 'Deve aceitar "malemolencia"');
    t.notOk(automato.verificar('malemolencia2'), 'Não deve aceitar "malemolencia2"');
    t.notOk(automato.verificar('outrapalavra'), 'Não deve aceitar "outrapalavra"');

    t.end();
});

tape('Verificar a linguagem L = { w | w é números naturais, incluindo o zero, porém sem zeros a esquerda }', (t) => {

    const automato = Automato.criar(
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
    );

    t.ok(automato.verificar('1234'), 'Deve aceitar "1234"');
    t.ok(automato.verificar('0'), 'Deve aceitar "1234"');
    t.notOk(automato.verificar('0123'), 'Não deve aceitar "0123"');
    t.notOk(automato.verificar('00'), 'Não deve aceitar "00"');
    t.notOk(automato.verificar('abc'), 'Não deve aceitar "abc"');

    t.end();
});
