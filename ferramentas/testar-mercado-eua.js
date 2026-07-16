var https = require("https");

var indices = [
    {
        nome: "S&P 500",
        simbolo: "%5EGSPC"
    },
    {
        nome: "Nasdaq",
        simbolo: "%5EIXIC"
    },
    {
        nome: "Dow Jones",
        simbolo: "%5EDJI"
    }
];

function baixarJson(url) {
    return new Promise(function (resolve, reject) {
        var opcoes = {
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        };

        https.get(url, opcoes, function (resposta) {
            var conteudo = "";

            if (resposta.statusCode !== 200) {
                resposta.resume();

                reject(
                    new Error(
                        "Resposta HTTP " +
                        resposta.statusCode
                    )
                );

                return;
            }

            resposta.setEncoding("utf8");

            resposta.on("data", function (parte) {
                conteudo += parte;
            });

            resposta.on("end", function () {
                try {
                    resolve(JSON.parse(conteudo));
                } catch (erro) {
                    reject(
                        new Error(
                            "Resposta JSON inválida."
                        )
                    );
                }
            });
        }).on("error", function (erro) {
            reject(erro);
        });
    });
}

function testarIndice(indice) {
    var url =
        "https://query1.finance.yahoo.com/v8/finance/chart/" +
        indice.simbolo +
        "?interval=1d&range=5d";

    return baixarJson(url)
        .then(function (dados) {
            var resultado;
            var meta;

            if (
                !dados ||
                !dados.chart ||
                !dados.chart.result ||
                dados.chart.result.length === 0
            ) {
                throw new Error(
                    "Nenhum resultado para " +
                    indice.nome
                );
            }

            resultado = dados.chart.result[0];
            meta = resultado.meta;

            console.log("");
            console.log("==========================");
            console.log(indice.nome);
            console.log("==========================");

            console.log(
                "Símbolo: " + meta.symbol
            );

            console.log(
                "Valor atual: " +
                meta.regularMarketPrice
            );

            console.log(
                "Fechamento anterior: " +
                meta.chartPreviousClose
            );
        });
}

function iniciarTeste() {
    var sequencia = Promise.resolve();
    var i;

    console.log(
        "Testando índices americanos..."
    );

    for (i = 0; i < indices.length; i++) {
        (function (indice) {
            sequencia = sequencia.then(
                function () {
                    return testarIndice(indice);
                }
            );
        })(indices[i]);
    }

    sequencia
        .then(function () {
            console.log("");
            console.log(
                "Teste concluído com sucesso."
            );
        })
        .catch(function (erro) {
            console.log("");
            console.log(
                "ERRO: " + erro.message
            );

            process.exit(1);
        });
}

iniciarTeste();