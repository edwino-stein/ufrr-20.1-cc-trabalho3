const tape = require('tape');
const Automato = require('../src/Automato');

tape('Verificar o construtor', (t) => {

    t.ok(
        new Automato() instanceof Automato,
        'Deve permitir contruir um objeto padrão'
    );

    t.throws(
        () => Automato.criar(),
        (e) => e === 'Alfabeto deve ser uma lista de simbulos',
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

tape('Verificar a linguagem L = { w | w termina com a }', (t) => {

    const automato = Automato.criar(
        [ 'a', 'b' ],
        {
            q0: { a: 'qf', b: 'q0' },
            qf: { a: 'qf', b: 'q0' }
        },
        [ 'qf' ],
        'q0'
    );

    t.ok(automato.verificar('aa'), 'Deve aceitar "aa"')
    t.notOk(automato.verificar('bb'), 'Não deve aceitar "baba"')
    t.notOk(automato.verificar('abab'), 'Não deve aceitar "baba"')
    t.ok(automato.verificar('bba'), 'Deve aceitar "bba"')

    t.end();
});
