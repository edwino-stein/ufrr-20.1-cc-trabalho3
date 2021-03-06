/**
 * Classe que representa um estado no automato
 */
class AutomatoEstado {

    constructor(nome, transicoes) {
        this._nome = nome;
        this._transicoes = transicoes;
    }

    /**
     * Nome que identifica o estado
     * @return {string}
     */
    get nome () { return this._nome; }

    /**
     * Retorna o próximo estado de acordo com a transição de saída referente a um símbolo
     * @param  {string} simbolo Símbolo referente a transição de sáida
     * @return {AutomatoEstado}
     */
    proximo (simbolo) {
        if(typeof(this._transicoes[simbolo]) === 'undefined') return null;
        else return this._transicoes[simbolo]();
    }
}

/**
 * Classe que representa um automato finito determinitico
 */
class Automato {

    constructor() {
        this._alfabeto = [];
        this._estados = [];
        this._finais = [];
        this._inicial = null;
    }

    /**
     * Lista de símbulos do alfabeto
     * @return {[string]}
     */
    get alfabeto () { return this._alfabeto; }

    /**
     * Lista de estados
     * @return {[AutomatoEstado]}
     */
    get estados () { return this._estados; }

    /**
     * Lista de estados finais
     * @return {[AutomatoEstado]}
     */
    get finais () { return this._finais; }

    /**
     * Estado inicial
     * @return {AutomatoEstado}
     */
    get inicial () { return this._inicial; }

    /**
     * Procura e retorna um estado pelo nome
     * @param  {string} e Nome do estado que será procurado
     * @return {AutomatoEstado}
     */
    estado (e) {
        const encontrado = this._estados.find((o) => o.nome === e);
        if(typeof(encontrado) === 'undefined') throw 'Estado não foi definido';
        return encontrado;
    }

    /**
     * Vericica se uma string é aceita pelo automato
     * @param  {string} entrada string de entrada
     * @return {boolean}
     */
    verificar (entrada, comExcecao) {

        // O automato deve ter sido corretamente inicializado
        if(this.inicial === null) {
            throw 'Automato não tem estado inicial';
        }

        // A entrada tem que ser uma string
        if (typeof(entrada) !== 'string') {
            throw 'A entrada deve ser uma string';
        }

        // Verifica se a função deve ou não gerar exceções ou apenas retornar falso
        if(typeof(comExcecao) !== 'boolean') comExcecao = false;

        // Define o estado atual como o inicial
        let estado = this.inicial;

        try {
            // Converte a entrada em uma lista de símbolos e define o estado inicial
            const simbolos = [...entrada];

            // Para cada símbolo
            for (const s of simbolos) {

                // Verifica se pertence ao alfabeto
                if(!this.alfabeto.includes(s)) throw 'Símbolo não pertence ao alfabeto';

                // Verifica se na última transição resultou em um estado válido
                if(estado === null) throw 'Símbolo levou a um estado inválido';

                // Realiza a transição para o proximo estado com base no símbolo atual
                estado = estado.proximo(s);
            }
        }
        catch(e){
            if(comExcecao) throw e;
            else return false;
        }


        // Quando acabar os símbolos, verifica se o estado atual é um dos finais
        return this.finais.includes(estado);
    }

    /**
     * Cria e inicializa uma instância de Automato
     * @param  {[string]} alfabeto Lista de símbolos do alfabeto
     * @param  {Object} estados  Objeto chave-valor que define os estados e transições
     * @param  {[string]} finais   Lista com os nomes dos estados finais
     * @param  {string} inicial  Nome do estado inicial
     * @return {Automato}
     */
    static criar (alfabeto, estados, finais, inicial) {

        // O alfabeto tem que ser uma lista
        if(typeof(alfabeto) !== 'object' || !(alfabeto instanceof Array)){
            throw 'Alfabeto deve ser uma lista de símbolos';
        }

        // Cria a instância de Automato e define o alfabeto
        const automato = new Automato();

        // Filtra entradas repetidas no alfabeto
        automato._alfabeto = alfabeto.filter((i, p) => alfabeto.indexOf(i) === p)

        // Os estados tem que ser um object javascript chave-valor
        if (typeof(estados) !== 'object') {
            throw 'Estados devem ser um objeto chave-valor';
        }

        // Compila os estados e transições
        Automato._compilarEstados(estados, automato);

        // Os estados finais tem que ser uma lista
        if(typeof(finais) !== 'object' || !(finais instanceof Array)){
            throw 'Estados finais deve ser uma lista de de estados';
        }

        // O estado inicial tem que ser uma string
        if(typeof(inicial) !== 'string'){
            throw 'O estado inicial deve ser o nome de um estado válido';
        }

        // Busca as instâncias dos estados finais e inicial
        for (const f of finais) automato._finais.push(automato.estado(f));
        automato._inicial = automato.estado(inicial);

        // Retorna a instância pronta
        return automato;
    }

    /**
     * Cria os estados e transições do automato
     * @param  {Object} estados  Objeto chave-valor que define os estados e transições
     * @param  {Automato} automato Instância do automato
     */
    static _compilarEstados (estados, automato) {

        // Guarda a lista com os nomes dos estados
        const listaEstadosNomes = Object.keys(estados);

        // Para cada estado definido
        for (const e of listaEstadosNomes) {

            // Guarda as transições de saída deste estado
            const transicoes = estados[e];

            // Cria um objeto chave-valor vazio para as transições prontas
            const transicoesResolvidas = {};

            // Guarda os símbulos do alfabeto para controle de utilização
            const simbolosAindaNaoUsados = [ ...automato.alfabeto ];

            // Para cada símbulo, define as transições de saída deste estado
            for (const s in transicoes) {
                if (!transicoes.hasOwnProperty(s)) continue;


                // Verifica se o símbulo pertence ao alfabeto
                if (!automato.alfabeto.includes(s)) {
                    throw 'Símbulo não foi definido no alfabeto';
                }

                // Verifica se o estado de destino foi definido
                if (!listaEstadosNomes.includes(transicoes[s])) {
                    throw 'Estado não foi definido';
                }

                // O símbulo não pode ter sido utilizado por esse estado com
                // alguma outra transição de saída
                if(!simbolosAindaNaoUsados.includes(s)){
                    throw 'O símbulos já foi utilizado em outra transição neste estado';
                }

                // Cria a função anonima da transição de saída para este símbolo
                transicoesResolvidas[s] = () => automato.estado(transicoes[s]);

                // Remove o símbolo das lista de símblos que ainda não foram
                // utilizados para este estado
                simbolosAindaNaoUsados.splice(simbolosAindaNaoUsados.indexOf(s), 1);
            }

            // Se faltou utilizar algum símbulo do alfabeto, cria transições que
            // levam a um estádo inválido
            if (simbolosAindaNaoUsados.length > 0) {
                for (const s of simbolosAindaNaoUsados) {
                    transicoesResolvidas[s] = (a) => null;
                }
            }

            // Cria a instância do estado com suas transições de saída
            automato._estados.push(new AutomatoEstado(e, transicoesResolvidas));
        }
    }
}

// Verifica se está rodando pelo Node.js
if(typeof module !== 'undefined' && module.exports){
    module.exports = Automato;
}
