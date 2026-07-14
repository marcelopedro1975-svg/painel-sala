var https = require("https");
var fs = require("fs");
var path = require("path");

var arquivoSaida = path.join(
    __dirname,
    "..",
    "mercado.js"
);

var tokenBrapi = process.env.BRAPI_TOKEN;

/* ==========================
   ENDEREÇOS DAS APIS
========================== */

var urlBitcoin =
    "https://api.coingecko.com/api/v3/simple/price" +
    "?ids=bitcoin" +
    "&vs_currencies=usd" +
    "&include_24hr_change=true";

var urlDolar =
    "https://api.bcb.gov.br/dados/serie/" +
    "bcdata.sgs.1/dados/ultimos/2" +
    "?formato=json";

var urlIbovespa =
    "https://brapi.dev/api/quote/%5EBVSP";

var urlIfix =
    "https://brapi.dev/api/quote/IFIX.SA";

/* ==========================
   REQUISIÇÃO HTTPS
========================== */

function baixarJson(url, cabecalhos) {
    return new Promise(function (resolve, reject) {
        var opcoes = {
            headers: cabecalhos || {}
        };

        https.get(url, opcoes, function (resposta) {
            var conteudo = "";

            if (
                resposta.statusCode >= 300 &&
                resposta.statusCode < 400 &&
                resposta.headers.location
            ) {
                resposta.resume();

                baixarJson(
                    resposta.headers.location,
                    cabecalhos
                ).then(resolve).catch(reject);

                return;
            }

            if (resposta.statusCode !== 200) {
                resposta.resume();

                reject(
                    new Error(
                        "Resposta HTTP " +
                        resposta.statusCode +
                        " em " +
                        url
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
                            "Resposta JSON inválida em " +
                            url
                        )
                    );
                }
            });
        }).on("error", function (erro) {
            reject(erro);
        });
    });
}

/* ==========================
   FORMATAÇÃO
========================== */

function formatarNumeroBrasil(
    numero,
    casasDecimais
) {
    return Number(numero).toLocaleString(
        "pt-BR",
        {
            minimumFractionDigits: casasDecimais,
            maximumFractionDigits: casasDecimais
        }
    );
}

function formatarVariacao(numero) {
    var valor = Number(numero);
    var seta;

    if (isNaN(valor)) {
        return "—";
    }

    if (valor > 0) {
        seta = "▲ ";
    } else if (valor < 0) {
        seta = "▼ ";
    } else {
        seta = "• ";
    }

    return (
        seta +
        formatarNumeroBrasil(
            Math.abs(valor),
            2
        ) +
        "%"
    );
}

function escaparJavaScript(texto) {
    return String(texto)
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"')
        .replace(/\r/g, "")
        .replace(/\n/g, " ");
}

/* ==========================
   LEITURA DOS DADOS
========================== */

function lerBitcoin(dados) {
    if (
        !dados ||
        !dados.bitcoin ||
        dados.bitcoin.usd === undefined
    ) {
        throw new Error(
            "Bitcoin não foi retornado pelo CoinGecko."
        );
    }

    return {
        nome: "Bitcoin",
        simbolo: "BTC",
        valor:
            "US$ " +
            formatarNumeroBrasil(
                dados.bitcoin.usd,
                0
            ),
        variacao: formatarVariacao(
            dados.bitcoin.usd_24h_change
        )
    };
}

function lerDolar(dados) {
    var anterior;
    var atual;
    var valorAnterior;
    var valorAtual;
    var variacao;

    if (!dados || dados.length < 2) {
        throw new Error(
            "Banco Central não retornou dois valores do dólar."
        );
    }

    anterior = dados[dados.length - 2];
    atual = dados[dados.length - 1];

    valorAnterior = parseFloat(
        String(anterior.valor).replace(",", ".")
    );

    valorAtual = parseFloat(
        String(atual.valor).replace(",", ".")
    );

    if (
        isNaN(valorAnterior) ||
        isNaN(valorAtual)
    ) {
        throw new Error(
            "Valor inválido do dólar."
        );
    }

    variacao =
        ((valorAtual - valorAnterior) /
            valorAnterior) *
        100;

    return {
        nome: "Dólar",
        simbolo: "USD",
        valor:
            "R$ " +
            formatarNumeroBrasil(
                valorAtual,
                2
            ),
        variacao: formatarVariacao(
            variacao
        )
    };
}

function obterResultadoBrapi(
    dados,
    simboloEsperado
) {
    var i;
    var resultado;

    if (
        !dados ||
        !dados.results ||
        dados.results.length === 0
    ) {
        throw new Error(
            "A brapi não retornou resultados para " +
            simboloEsperado +
            "."
        );
    }

    for (i = 0; i < dados.results.length; i++) {
        resultado = dados.results[i];

        if (resultado.symbol === simboloEsperado) {
            return resultado;
        }
    }

    throw new Error(
        "Símbolo " +
        simboloEsperado +
        " não encontrado na resposta da brapi."
    );
}

function lerIndice(
    dados,
    simbolo,
    nome,
    casasDecimais
) {
    var resultado =
        obterResultadoBrapi(
            dados,
            simbolo
        );

    if (
        resultado.regularMarketPrice === undefined ||
        resultado.regularMarketPrice === null
    ) {
        throw new Error(
            "Preço não encontrado para " +
            nome +
            "."
        );
    }

    return {
        nome: nome,
        simbolo: simbolo,
        valor: formatarNumeroBrasil(
            resultado.regularMarketPrice,
            casasDecimais
        ),
        variacao: formatarVariacao(
            resultado.regularMarketChangePercent
        )
    };
}

/* ==========================
   GERAÇÃO DO mercado.js
========================== */

function montarItem(item, incluirVirgula) {
    var texto = "";

    texto += "    {\n";

    texto +=
        '        nome: "' +
        escaparJavaScript(item.nome) +
        '",\n';

    texto +=
        '        simbolo: "' +
        escaparJavaScript(item.simbolo) +
        '",\n';

    texto +=
        '        valor: "' +
        escaparJavaScript(item.valor) +
        '",\n';

    texto +=
        '        variacao: "' +
        escaparJavaScript(item.variacao) +
        '"\n';

    texto += "    }";

    if (incluirVirgula) {
        texto += ",";
    }

    texto += "\n";

    return texto;
}

function gerarArquivo(itensBrasil) {
    var conteudo = "";
    var i;

    conteudo += "var MERCADO_BRASIL = [\n";

    for (i = 0; i < itensBrasil.length; i++) {
        conteudo += montarItem(
            itensBrasil[i],
            i < itensBrasil.length - 1
        );
    }

    conteudo += "];\n\n";

    /*
       Mercado EUA permanece com valores de teste.
       Ele será conectado a uma fonte real na próxima etapa.
    */

    conteudo += "var MERCADO_EUA = [\n";

    conteudo += montarItem(
        {
            nome: "S&P 500",
            simbolo: "SP500",
            valor: "6.420",
            variacao: "▲ 0,51%"
        },
        true
    );

    conteudo += montarItem(
        {
            nome: "Nasdaq",
            simbolo: "NASDAQ",
            valor: "21.300",
            variacao: "▲ 0,83%"
        },
        true
    );

    conteudo += montarItem(
        {
            nome: "Dow Jones",
            simbolo: "DOW",
            valor: "44.820",
            variacao: "▼ 0,12%"
        },
        false
    );

    conteudo += "];\n";

    fs.writeFileSync(
        arquivoSaida,
        conteudo,
        "utf8"
    );
}

/* ==========================
   EXECUÇÃO
========================== */

function iniciarGeracao() {
    var cabecalhosBrapi;

    if (!tokenBrapi) {
        console.log(
            "ERRO: BRAPI_TOKEN não foi encontrado."
        );

        console.log(
            "O arquivo mercado.js anterior foi preservado."
        );

        process.exit(1);
    }

    cabecalhosBrapi = {
        Authorization:
            "Bearer " + tokenBrapi,

        "User-Agent":
            "SalaPad-Mercado/1.0"
    };

    console.log(
        "Buscando dados reais do mercado..."
    );

    Promise.all([
        baixarJson(
            urlBitcoin,
            {
                "User-Agent":
                    "SalaPad-Mercado/1.0"
            }
        ),

        baixarJson(urlDolar),

        baixarJson(
            urlIfix,
            cabecalhosBrapi
        ),

        baixarJson(
            urlIbovespa,
            cabecalhosBrapi
        )
    ])
        .then(function (respostas) {
            var bitcoin =
                lerBitcoin(respostas[0]);

            var dolar =
                lerDolar(respostas[1]);

            var ifix =
                lerIndice(
                    respostas[2],
                    "IFIX.SA",
                    "IFIX",
                    2
                );

            var ibovespa =
                lerIndice(
                    respostas[3],
                    "^BVSP",
                    "Ibovespa",
                    0
                );

            gerarArquivo([
                bitcoin,
                dolar,
                ifix,
                ibovespa
            ]);

            console.log("");
            console.log(
                "Bitcoin atualizado: " +
                bitcoin.valor
            );

            console.log(
                "Dólar atualizado: " +
                dolar.valor
            );

            console.log(
                "IFIX atualizado: " +
                ifix.valor
            );

            console.log(
                "Ibovespa atualizado: " +
                ibovespa.valor
            );

            console.log("");
            console.log(
                "Arquivo mercado.js gerado com sucesso."
            );
        })
        .catch(function (erro) {
            console.log("");
            console.log(
                "ERRO: " + erro.message
            );

            console.log(
                "O arquivo mercado.js anterior foi preservado."
            );

            process.exit(1);
        });
}

iniciarGeracao();