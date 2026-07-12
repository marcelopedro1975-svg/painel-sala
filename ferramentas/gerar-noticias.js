var https = require("https");
var fs = require("fs");
var path = require("path");

var urlFeed =
    "https://agenciabrasil.ebc.com.br/rss/ultimasnoticias/feed.xml";

var arquivoSaida = path.join(__dirname, "..", "noticias.js");

var quantidadeNoticias = 20;

function decodificarEntidades(texto) {
    return texto
        .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&#8211;/g, "–")
        .replace(/&#8212;/g, "—")
        .replace(/&#8220;/g, "“")
        .replace(/&#8221;/g, "”")
        .replace(/&#8230;/g, "…");
}

function limparTexto(texto) {
    return decodificarEntidades(texto)
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

function escaparJavaScript(texto) {
    return texto
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"')
        .replace(/\r/g, "")
        .replace(/\n/g, " ");
}

function extrairNoticias(xml) {
    var noticias = [];
    var itens = xml.match(/<item>[\s\S]*?<\/item>/g);
    var i;
    var resultadoTitulo;
    var titulo;

    if (!itens) {
        return noticias;
    }

    for (
        i = 0;
        i < itens.length && noticias.length < quantidadeNoticias;
        i++
    ) {
        resultadoTitulo = itens[i].match(
            /<title>([\s\S]*?)<\/title>/
        );

        if (resultadoTitulo && resultadoTitulo[1]) {
            titulo = limparTexto(resultadoTitulo[1]);

            if (titulo !== "") {
                noticias.push({
                    fonte: "Agência Brasil",
                    titulo: titulo
                });
            }
        }
    }

    return noticias;
}

function gerarArquivo(noticias) {
    var conteudo = "var NOTICIAS = [\n";
    var i;

    for (i = 0; i < noticias.length; i++) {
        conteudo += "    {\n";
        conteudo += '        fonte: "' +
            escaparJavaScript(noticias[i].fonte) +
            '",\n';
        conteudo += '        titulo: "' +
            escaparJavaScript(noticias[i].titulo) +
            '"\n';
        conteudo += "    }";

        if (i < noticias.length - 1) {
            conteudo += ",";
        }

        conteudo += "\n";
    }

    conteudo += "];\n";

    fs.writeFileSync(
        arquivoSaida,
        conteudo,
        "utf8"
    );
}

console.log("Buscando notícias da Agência Brasil...");

https.get(urlFeed, function (resposta) {
    var xml = "";

    if (
        resposta.statusCode >= 300 &&
        resposta.statusCode < 400 &&
        resposta.headers.location
    ) {
        console.log("O feed foi redirecionado.");
        console.log("Execute novamente se necessário.");
        resposta.resume();
        process.exit(1);
    }

    if (resposta.statusCode !== 200) {
        console.log(
            "ERRO: o feed respondeu com status " +
            resposta.statusCode
        );

        resposta.resume();
        process.exit(1);
    }

    resposta.setEncoding("utf8");

    resposta.on("data", function (parte) {
        xml += parte;
    });

    resposta.on("end", function () {
        var noticias = extrairNoticias(xml);

        if (noticias.length === 0) {
            console.log(
                "ERRO: nenhuma notícia foi encontrada."
            );

            console.log(
                "O arquivo noticias.js anterior foi preservado."
            );

            process.exit(1);
        }

        gerarArquivo(noticias);

        console.log("");
        console.log(
            noticias.length + " notícias encontradas."
        );

        console.log("");
        console.log(
            "Arquivo noticias.js gerado com sucesso."
        );
    });
}).on("error", function (erro) {
    console.log(
        "ERRO ao acessar o feed: " + erro.message
    );

    console.log(
        "O arquivo noticias.js anterior foi preservado."
    );

    process.exit(1);
});