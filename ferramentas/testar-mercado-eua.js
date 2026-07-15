var https = require("https");

var apiKey = process.env.TWELVE_DATA_API_KEY;

var pesquisas = [
    "S&P 500",
    "Nasdaq Composite",
    "Dow Jones Industrial Average"
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

function mostrarResultados(nomePesquisa, dados) {
    var resultados;
    var i;
    var item;

    console.log("");
    console.log("==========================");
    console.log("Pesquisa: " + nomePesquisa);
    console.log("==========================");

    if (
        !dados ||
        !dados.data ||
        dados.data.length === 0
    ) {
        console.log(
            "Nenhum resultado encontrado."
        );

        return;
    }

    resultados = dados.data;

    for (
        i = 0;
        i < resultados.length && i < 10;
        i++
    ) {
        item = resultados[i];

        console.log("");
        console.log(
            "Símbolo: " + item.symbol
        );

        console.log(
            "Nome: " + item.instrument_name
        );

        console.log(
            "Tipo: " + item.instrument_type
        );

        console.log(
            "País: " + item.country
        );

        console.log(
            "Bolsa: " + item.exchange
        );
    }
}

function pesquisarSimbolo(nomePesquisa) {
    var url =
        "https://api.twelvedata.com/symbol_search" +
        "?symbol=" +
        encodeURIComponent(nomePesquisa) +
        "&apikey=" +
        encodeURIComponent(apiKey);

    return baixarJson(url)
        .then(function (dados) {
            mostrarResultados(
                nomePesquisa,
                dados
            );
        });
}

function iniciarTeste() {
    var sequencia;
    var i;

    if (!apiKey) {
        console.log(
            "ERRO: TWELVE_DATA_API_KEY não encontrado."
        );

        process.exit(1);
    }

    console.log(
        "Pesquisando índices americanos..."
    );

    sequencia = Promise.resolve();

    for (i = 0; i < pesquisas.length; i++) {
        (function (nomePesquisa) {
            sequencia = sequencia.then(
                function () {
                    return pesquisarSimbolo(
                        nomePesquisa
                    );
                }
            );
        })(pesquisas[i]);
    }

    sequencia
        .then(function () {
            console.log("");
            console.log(
                "Pesquisa concluída."
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