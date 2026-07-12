var https = require("https");
var fs = require("fs");
var path = require("path");

var feeds = [
    {
        nome: "Últimas Notícias",
        url: "https://agenciabrasil.ebc.com.br/rss/ultimasnoticias/feed.xml"
    },
    {
        nome: "Economia",
        url: "https://agenciabrasil.ebc.com.br/rss/economia/feed.xml"
    },
    {
        nome: "Política",
        url: "https://agenciabrasil.ebc.com.br/rss/politica/feed.xml"
    },
    {
        nome: "Internacional",
        url: "https://agenciabrasil.ebc.com.br/rss/internacional/feed.xml"
    },
    {
        nome: "Saúde",
        url: "https://agenciabrasil.ebc.com.br/rss/saude/feed.xml"
    },
    {
        nome: "Esportes",
        url: "https://agenciabrasil.ebc.com.br/rss/esportes/feed.xml"
    },
    {
        nome: "Educação",
        url: "https://agenciabrasil.ebc.com.br/rss/educacao/feed.xml"
    },
    {
        nome: "Justiça",
        url: "https://agenciabrasil.ebc.com.br/rss/justica/feed.xml"
    }
];

var arquivoSaida = path.join(
    __dirname,
    "..",
    "noticias.js"
);

var quantidadeNoticias = 20;
var noticiasEncontradas = [];
var feedsConcluidos = 0;

function decodificarEntidades(texto) {
    if (!texto) {
        return "";
    }

    return texto
        .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#034;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&nbsp;/g, " ")
        .replace(/&#8211;/g, "–")
        .replace(/&#8212;/g, "—")
        .replace(/&#8216;/g, "‘")
        .replace(/&#8217;/g, "’")
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

function normalizarTitulo(texto) {
    return limparTexto(texto)
        .toLowerCase()
        .replace(/[áàâãä]/g, "a")
        .replace(/[éèêë]/g, "e")
        .replace(/[íìîï]/g, "i")
        .replace(/[óòôõö]/g, "o")
        .replace(/[úùûü]/g, "u")
        .replace(/ç/g, "c")
        .replace(/[^a-z0-9]/g, "");
}

function escaparJavaScript(texto) {
    return texto
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"')
        .replace(/\r/g, "")
        .replace(/\n/g, " ");
}

function extrairCampo(item, nomeCampo) {
    var expressao = new RegExp(
        "<" + nomeCampo + "[^>]*>([\\s\\S]*?)<\\/" +
        nomeCampo + ">",
        "i"
    );

    var resultado = item.match(expressao);

    if (resultado && resultado[1]) {
        return limparTexto(resultado[1]);
    }

    return "";
}

function extrairNoticias(xml, nomeFeed) {
    var noticias = [];
    var itens = xml.match(
        /<item\b[^>]*>[\s\S]*?<\/item>/gi
    );

    var i;
    var titulo;
    var dataTexto;
    var dataPublicacao;

    if (!itens) {
        return noticias;
    }

    for (i = 0; i < itens.length; i++) {
        titulo = extrairCampo(
            itens[i],
            "title"
        );

        dataTexto = extrairCampo(
            itens[i],
            "pubDate"
        );

        dataPublicacao = new Date(
            dataTexto
        ).getTime();

        if (isNaN(dataPublicacao)) {
            dataPublicacao = 0;
        }

        if (titulo !== "") {
            noticias.push({
                fonte: "Agência Brasil",
                editoria: nomeFeed,
                titulo: titulo,
                data: dataPublicacao
            });
        }
    }

    return noticias;
}

function removerDuplicadas(noticias) {
    var resultado = [];
    var titulosEncontrados = {};
    var i;
    var chave;

    for (i = 0; i < noticias.length; i++) {
        chave = normalizarTitulo(
            noticias[i].titulo
        );

        if (
            chave !== "" &&
            !titulosEncontrados[chave]
        ) {
            titulosEncontrados[chave] = true;
            resultado.push(noticias[i]);
        }
    }

    return resultado;
}

function ordenarPorData(noticias) {
    noticias.sort(function (a, b) {
        return b.data - a.data;
    });

    return noticias;
}

function gerarArquivo(noticias) {
    var conteudo = "var NOTICIAS = [\n";
    var i;

    for (i = 0; i < noticias.length; i++) {
        conteudo += "    {\n";

        conteudo +=
            '        fonte: "' +
            escaparJavaScript(
                noticias[i].fonte
            ) +
            '",\n';

        conteudo +=
            '        titulo: "' +
            escaparJavaScript(
                noticias[i].titulo
            ) +
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

function concluirGeracao() {
    var noticiasFinais;

    noticiasFinais = removerDuplicadas(
        noticiasEncontradas
    );

    noticiasFinais = ordenarPorData(
        noticiasFinais
    );

    if (
        noticiasFinais.length >
        quantidadeNoticias
    ) {
        noticiasFinais =
            noticiasFinais.slice(
                0,
                quantidadeNoticias
            );
    }

    if (noticiasFinais.length === 0) {
        console.log("");
        console.log(
            "ERRO: nenhuma notícia foi encontrada."
        );

        console.log(
            "O arquivo noticias.js anterior foi preservado."
        );

        process.exit(1);
    }

    gerarArquivo(noticiasFinais);

    console.log("");
    console.log(
        noticiasFinais.length +
        " notícias diferentes encontradas."
    );

    console.log("");
    console.log(
        "Arquivo noticias.js gerado com sucesso."
    );
}

function verificarConclusao() {
    feedsConcluidos++;

    if (feedsConcluidos >= feeds.length) {
        concluirGeracao();
    }
}

function baixarFeed(feed, url, redirecionamentos) {
    https.get(url, function (resposta) {
        var xml = "";
        var novaUrl;

        if (
            resposta.statusCode >= 300 &&
            resposta.statusCode < 400 &&
            resposta.headers.location
        ) {
            resposta.resume();

            if (redirecionamentos >= 5) {
                console.log(
                    "ERRO em " +
                    feed.nome +
                    ": muitos redirecionamentos."
                );

                verificarConclusao();
                return;
            }

            novaUrl = resposta.headers.location;

            if (
                novaUrl.indexOf("http") !== 0
            ) {
                novaUrl =
                    "https://agenciabrasil.ebc.com.br" +
                    novaUrl;
            }

            baixarFeed(
                feed,
                novaUrl,
                redirecionamentos + 1
            );

            return;
        }

        if (resposta.statusCode !== 200) {
            console.log(
                "Feed " +
                feed.nome +
                " respondeu com status " +
                resposta.statusCode +
                "."
            );

            resposta.resume();
            verificarConclusao();
            return;
        }

        resposta.setEncoding("utf8");

        resposta.on("data", function (parte) {
            xml += parte;
        });

        resposta.on("end", function () {
            var noticiasDoFeed;

            noticiasDoFeed = extrairNoticias(
                xml,
                feed.nome
            );

            console.log(
                feed.nome +
                ": " +
                noticiasDoFeed.length +
                " notícias."
            );

            noticiasEncontradas =
                noticiasEncontradas.concat(
                    noticiasDoFeed
                );

            verificarConclusao();
        });
    }).on("error", function (erro) {
        console.log(
            "ERRO ao acessar " +
            feed.nome +
            ": " +
            erro.message
        );

        verificarConclusao();
    });
}

function iniciarGeracao() {
    var i;

    console.log(
        "Buscando notícias da Agência Brasil..."
    );

    console.log("");

    for (i = 0; i < feeds.length; i++) {
        baixarFeed(
            feeds[i],
            feeds[i].url,
            0
        );
    }
}

iniciarGeracao();