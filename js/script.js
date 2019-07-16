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
        const tags = getXmlTags(xml);
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
