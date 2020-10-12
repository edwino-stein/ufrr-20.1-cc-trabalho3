$(document).ready(() => {

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
