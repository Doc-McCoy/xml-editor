$(document).ready(function() {

    var xml;

    $("#editar").click(function(e) {

        e.preventDefault();

        $("#form").empty();
        const code = $("#xml").val();
        xml = parseXml(code);

        if (!verificarXmlValido(xml)) {
            alert("O XML digitado não é válido!");
            $("#info").show();
            return false;
        }

        $("#info").hide();
        const tags = getXmlTags(code);
        tags.forEach(criaInputs);
    });

    $("#copiar").click(function(e) {
        e.preventDefault();
        copiarTextoParaClipboard();
    });

    $('#form').on('change', 'input', function() {
        const tag = $(this).attr('name');
        const val = $(this).val();
        atualizaValorDoXml(tag, val);
        atualizaTextAreaXml();
    })

    function parseXml(stringXml) {
        const parser = new DOMParser();
        const xmlParsed = parser.parseFromString(stringXml, "text/xml");

        return xmlParsed;
    }

    function verificarXmlValido(xml) {
        return (xml.documentElement.nodeName != "parsererror");
    }

    function getXmlTags(stringXml) {
        // Regex que pega a palavra entre o '<ens:' e o '>'
        const regex = /<ens:(.*?)>/gm; // g: global, m: multilines
        let match = regex.exec(stringXml);
        let retorno = [];

        while (match != null) {
            retorno.push({
                'tag': match[0].replace("<", "").replace(">", ""),
                'label': match[1]
            });
            match = regex.exec(stringXml);
        }

        return retorno;
    }

    function copiarTextoParaClipboard() {
        let text = $("#xml");
        text.select();
        document.execCommand("copy");
    }

    function criaInputs(objTagLabel) {
        const form = $("#form");
        const label = $(`<label for="${objTagLabel.label}">${objTagLabel.label}</label>`);
        const valor = getValorAtualDaTagNoXml(objTagLabel.tag);
        const input = $(`<input
            class="u-full-width"
            type="text"
            id="${objTagLabel.label}"
            name="${objTagLabel.tag}"
            value="${valor}"
        />`);

        form.append(label);
        form.append(input);
    }

    function getValorAtualDaTagNoXml(tag) {
        const valor = xml.getElementsByTagName(tag)[0].childNodes[0].nodeValue;
        return valor;
    }

    function atualizaValorDoXml(tag, valor) {
        xml.getElementsByTagName(tag)[0].childNodes[0].nodeValue = valor;
    }

    function atualizaTextAreaXml() {
        const stringXml = xml.documentElement.outerHTML;
        $('#xml').val(stringXml);
    }
});
