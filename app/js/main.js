function renderLinguagenItemTpl(nome, definicao, alfabeto) {

    const $itemTpl = $($.parseHTML(
        `<a class="item">
            <h5 class="ui header">
                <span class="nome"></span> =
                { <span class="definicao"></span> }
            </h5>
            <p>Alfabeto: <b>{ <span class="alfabeto"></span> }</b></p>
        </a>`
    )[0]);

    $itemTpl.attr('data-tab', 'lang-' + nome);
    $itemTpl.find('.header .nome').append(nome);
    $itemTpl.find('.header .definicao').append(definicao);
    $itemTpl.find('.alfabeto').append(alfabeto.join(', '));

    return $itemTpl;
}

function renderLinguagenAutomatoTpl(nome, automato) {
    const $tabTpl = $($.parseHTML(
        `<div class="ui tab">
            <table class="ui definition celled small compact table center aligned">
                <thead><tr><th></th></tr></thead>
                <tbody></tbody>
            </table>
        </div>`
    )[0]);

    const $tableTpl = $tabTpl.find('table');

    for (const s of automato.alfabeto) {
        $tableTpl.find('thead > tr').append(`<th>${s}</th>`);
    }

    for (const e of automato.estados) {
        const inicial = automato.inicial === e ? '&#x2192; ' : '';
        const final = automato.finais.includes(e) ? '*' : '';

        const $rowTpl = $($.parseHTML(
            `<tr><td>${inicial}${e.nome}${final}</td></tr>`
        )[0]);

        for (const s of automato.alfabeto) {
            $rowTpl.append(`<td>${e.proximo(s).nome}</td>`);
        }

        $tableTpl.find('tbody').append($rowTpl);
    }

    $tabTpl.attr('data-tab', 'lang-' + nome);
    return $tabTpl;
}

function renderLinguagens() {
    const $lista = $('#linguagens .menu');
    const $tabs = $('#linguagens .tabs');

    for (const l in LINGUAGENS) {
        if (!LINGUAGENS.hasOwnProperty(l)) continue;

        $lista.append(renderLinguagenItemTpl(
            l,
            LINGUAGENS[l].definicao,
            LINGUAGENS[l].automato.alfabeto
        ));

        $tabs.append(renderLinguagenAutomatoTpl(l, LINGUAGENS[l].automato))
    }

    $($lista.children()[0]).addClass('active');
    $($tabs.children()[0]).addClass('active');
    $lista.children().tab();
}

$(document).ready(() => {
    renderLinguagens();

    $("#source-code").val(
        [
            'aabb',
            'abab',
            '100101010',
            '00001',
            'xyyxx',
            'yyxx',
            'aababcbcbac',
            'aaabbbccc',
            'nenhumavaiaceitar'
        ].join('\n')
    );
    $("#load-file-btn").click((e) => { $("#load-file-input").click() });
    $("#load-file-input").change((e) => {

        const file = e.target.files[0];
        if(typeof(file) !== "object") return;

        const fileReader = new FileReader();

        fileReader.onload = (d) => {
            const src = $("#source-code");
            src.empty();
            src.val(fileReader.result);
        };

        fileReader.readAsText(file);
    });
});