$(document).ready(function() {

    var xml;

    $("#editar").click(function(e) {

        e.preventDefault();

        // Limpar o form, caso já exista um
        $("#form").empty();

        /* Dar trim para corrigir eventuais espaços
        em branco ou quebra de linha que inviabilizam
        o reconhecimento do XML pelo DOMParser */
        $("#xml").val($("#xml").val().trim());

        const code = $("#xml").val();

        xml = parseXml(code);

        // Validar o XML
        if (!verificarXmlValido(xml)) {
            alert("O XML digitado não é válido!");
            $("#info").show();
            return false;
        }

        $("#info").hide();

        // Pegar as tags do XML
        const tags = getXmlTags(xml);

        // Criar um input no form para cada tag do XML
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

    function getXmlTags(parsedXml) {
        const objTags = parsedXml.getElementsByTagName("*");
        let tags = [];
        for (let i = 0; i < objTags.length; i++) {
            const tag = objTags[i];
            tags.push(tag.nodeName);
        }

        return tags;
    }

    function copiarTextoParaClipboard() {
        let text = $("#xml");
        text.select();
        document.execCommand("copy");
    }

    function criaInputs(tagLabel) {
        const form = $("#form");
        const label = $(`<label for="${tagLabel}">${tagLabel}</label>`);
        const valor = getValorAtualDaTagNoXml(tagLabel);
        const input = $(`<input
            class="u-full-width"
            type="text"
            id="${tagLabel}"
            name="${tagLabel}"
            value="${valor}"
        />`);

        form.append(label);
        form.append(input);
    }

    function getValorAtualDaTagNoXml(tag) {
        let valor = "";
        const child = xml.getElementsByTagName(tag)[0].childNodes;

        if (child.length > 0) {
            valor = xml.getElementsByTagName(tag)[0].childNodes[0].nodeValue;
        }

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
