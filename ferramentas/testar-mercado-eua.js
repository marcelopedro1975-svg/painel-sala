var https = require("https");

var apiKey = process.env.TWELVE_DATA_API_KEY;

var simbolos = [
    {
        nome: "S&P 500",
        simbolo: "SPX"
    },
    {
        nome: "Nasdaq Composite",
        simbolo: "IXIC"
    },
    {
        nome: "Dow Jones Industrial Average",
        simbolo: "DJI"
    }
];

function baixarJson(url) {
    return new Promise(function (resolve, reject) {
        https.get(url, function (resposta) {
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

function testarSimbolo(item) {
    var url =
        "https://api.twelvedata.com/quote" +
        "?symbol=" +
        encodeURIComponent(item.simbolo) +
        "&apikey=" +
        encodeURIComponent(apiKey);

    return baixarJson(url)
        .then(function (dados) {
            console.log("");
            console.log("==========================");
            console.log(item.nome);
            console.log("==========================");
            console.log(JSON.stringify(dados, null, 2));
        });
}

function iniciarTeste() {
    var sequencia = Promise.resolve();
    var i;

    if (!apiKey) {
        console.log(
            "ERRO: TWELVE_DATA_API_KEY não encontrado."
        );

        process.exit(1);
    }

    console.log(
        "Testando códigos dos índices americanos..."
    );

    for (i = 0; i < simbolos.length; i++) {
        (function (item) {
            sequencia = sequencia.then(
                function () {
                    return testarSimbolo(item);
                }
            );
        })(simbolos[i]);
    }

    sequencia
        .then(function () {
            console.log("");
            console.log("Teste concluído.");
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