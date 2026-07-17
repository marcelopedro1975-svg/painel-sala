/* ==========================
   FOTOS
========================== */

var fotos = FOTOS;

function embaralharFotos(lista) {
    var i = lista.length;
    var j;
    var temp;

    while (i > 0) {
        j = Math.floor(Math.random() * i);
        i--;

        temp = lista[i];
        lista[i] = lista[j];
        lista[j] = temp;
    }

    return lista;
}

fotos = embaralharFotos(fotos);

var slideA = document.getElementById("slideA");
var slideB = document.getElementById("slideB");

var slideAtual = slideA;
var proximoSlide = slideB;

var indiceFoto = 0;

function preCarregarProximaFoto() {
    var proximoIndice = indiceFoto + 1;
    var img;

    if (proximoIndice >= fotos.length) {
        proximoIndice = 0;
    }

    img = new Image();
    img.src = fotos[proximoIndice];
}

function mostrarFoto() {
    var imagem = new Image();

    imagem.onload = function () {
        proximoSlide.style.webkitAnimation = "none";
        proximoSlide.style.animation = "none";

        proximoSlide.style.backgroundImage =
            "url('" + fotos[indiceFoto] + "')";

        proximoSlide.offsetHeight;

        proximoSlide.style.webkitAnimation =
            "kenburns 30s linear infinite alternate";

        proximoSlide.style.animation =
            "kenburns 30s linear infinite alternate";

        proximoSlide.className = "slide ativo";
        slideAtual.className = "slide";

        var temporario = slideAtual;

        slideAtual = proximoSlide;
        proximoSlide = temporario;

        indiceFoto++;

        if (indiceFoto >= fotos.length) {
            indiceFoto = 0;
        }

        preCarregarProximaFoto();
    };

    imagem.src = fotos[indiceFoto];
}

mostrarFoto();
preCarregarProximaFoto();

setInterval(
    mostrarFoto,
    CONFIG.intervaloFotos
);

/* ==========================
   RELÓGIO E DATA
========================== */

function adicionarZero(numero) {
    if (numero < 10) {
        return "0" + numero;
    }

    return numero;
}

function atualizarHora() {
    var agora = new Date();
    var horas = adicionarZero(agora.getHours());
    var minutos = adicionarZero(agora.getMinutes());

    document.getElementById("hora").innerHTML =
        horas + ":" + minutos;

    document.getElementById("data").innerHTML =
        agora.toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
}

atualizarHora();

setInterval(
    atualizarHora,
    30000
);

/* ==========================
   CLIMA
========================== */

document.getElementById("cidade").innerHTML =
    CONFIG.cidade;

function obterIconeClima(codigo) {
    if (codigo === 0) {
        return "☀️";
    }

    if (codigo === 1 || codigo === 2) {
        return "🌤️";
    }

    if (codigo === 3) {
        return "☁️";
    }

    if (codigo >= 45 && codigo <= 48) {
        return "🌫️";
    }

    if (codigo >= 51 && codigo <= 67) {
        return "🌧️";
    }

    if (codigo >= 71 && codigo <= 77) {
        return "❄️";
    }

    if (codigo >= 80 && codigo <= 82) {
        return "🌦️";
    }

    if (codigo >= 95) {
        return "⛈️";
    }

    return "🌡️";
}

function atualizarTemperatura() {
    var xhr = new XMLHttpRequest();

    var url =
        "https://api.open-meteo.com/v1/forecast" +
        "?latitude=" + CONFIG.latitude +
        "&longitude=" + CONFIG.longitude +
        "&current=temperature_2m,weather_code";

    xhr.open("GET", url, true);

    xhr.onload = function () {
        var dados;
        var codigo;

        if (xhr.status === 200) {
            dados = JSON.parse(xhr.responseText);
            codigo = dados.current.weather_code;

            document.getElementById("iconeClima").innerHTML =
                obterIconeClima(codigo);

            document.getElementById("temperatura").innerHTML =
                Math.round(
                    dados.current.temperature_2m
                ) + "°C";
        } else {
            document.getElementById("temperatura").innerHTML =
                "--°";
        }
    };

    xhr.onerror = function () {
        document.getElementById("temperatura").innerHTML =
            "--°";
    };

    xhr.send();
}

atualizarTemperatura();

setInterval(
    atualizarTemperatura,
    CONFIG.intervaloClima
);

/* ==========================
   PAINEL INFORMATIVO
========================== */

var painelInformativoVisivel = false;
var cicloPainelAtivo = false;
var temporizadorPainel = null;

function exibirPainelInformativo(
    titulo,
    fonte,
    conteudo
) {
    var painel =
        document.getElementById("painelInformativo");

    var tituloPainel =
        document.getElementById("tituloPainel");

    var fontePainel =
        document.getElementById("fontePainel");

    var conteudoPainel =
        document.getElementById("conteudoPainel");

    painel.className = "visivel";
    painelInformativoVisivel = true;

    conteudoPainel.className = "oculto";

    setTimeout(function () {
        tituloPainel.innerHTML = titulo;
        fontePainel.innerHTML = fonte;
        conteudoPainel.innerHTML = conteudo;

        conteudoPainel.className = "visivel";
    }, 600);
}

function ocultarPainelInformativo() {
    var painel =
        document.getElementById("painelInformativo");

    painel.className = "oculto";
    painelInformativoVisivel = true;
}

function pararTemporizadorPainel() {
    if (temporizadorPainel !== null) {
        clearTimeout(temporizadorPainel);
        temporizadorPainel = null;
    }
}

/* ==========================
   FORMATAÇÃO DO MERCADO
========================== */

function montarLinhaMercado(item) {
    return (
        '<div class="linhaMercado">' +
            '<span class="nomeMercado">' +
                item.nome +
            "</span>" +
            '<span class="valorMercado">' +
                item.valor +
            "</span>" +
            '<span class="variacaoMercado">' +
                item.variacao +
            "</span>" +
        "</div>"
    );
}

function montarConteudoMercado(lista) {
    var conteudo = "";
    var i;

    for (i = 0; i < lista.length; i++) {
        conteudo += montarLinhaMercado(lista[i]);
    }

    return conteudo;
}

function mostrarMercadoBrasil() {
    exibirPainelInformativo(
        "MERCADO",
        "Bitcoin em dólar e índices brasileiros",
        montarConteudoMercado(MERCADO_BRASIL)
    );
}

function mostrarMercadoEUA() {
    exibirPainelInformativo(
        "MERCADO EUA",
        "Principais índices americanos",
        montarConteudoMercado(MERCADO_EUA)
    );
}

/* ==========================
   NOTÍCIAS
========================== */

var indiceNoticia = 0;
var noticiasDesdeUltimoMercado = 0;

/*
   O primeiro mercado exibido será o brasileiro.
   Depois alterna para o americano.
*/

var proximoMercado = "brasil";

function noticiasDisponiveis() {
    return (
        typeof NOTICIAS !== "undefined" &&
        NOTICIAS !== null &&
        NOTICIAS.length > 0
    );
}

function mostrarNoticiaAtual() {
    if (!noticiasDisponiveis()) {
        exibirPainelInformativo(
            "NOTÍCIAS",
            "SalaPad",
            "Nenhuma notícia disponível."
        );

        return;
    }

    if (indiceNoticia >= NOTICIAS.length) {
        indiceNoticia = 0;
    }

    exibirPainelInformativo(
        "NOTÍCIAS",
        NOTICIAS[indiceNoticia].fonte,
        NOTICIAS[indiceNoticia].titulo
    );

    indiceNoticia++;

    if (indiceNoticia >= NOTICIAS.length) {
        indiceNoticia = 0;
    }

    noticiasDesdeUltimoMercado++;
}

/* ==========================
   CICLO: NOTÍCIAS E MERCADOS
========================== */

function painelDeveFicarVisivel() {
    var agora;
    var minuto;

    if (CONFIG.painelSempreVisivel === true) {
        return true;
    }

    agora = new Date();
    minuto = agora.getMinutes();

    return minuto < CONFIG.minutoFimPainel;
}

function mostrarProximoItemPainel() {
    if (!painelDeveFicarVisivel()) {
        cicloPainelAtivo = false;

        pararTemporizadorPainel();
        ocultarPainelInformativo();

        return;
    }

    /*
       Depois de 10 notícias, mostra um mercado.
    */

    if (
        noticiasDesdeUltimoMercado >=
        CONFIG.noticiasAntesMercado
    ) {
        noticiasDesdeUltimoMercado = 0;

        if (proximoMercado === "brasil") {
            mostrarMercadoBrasil();
            proximoMercado = "eua";
        } else {
            mostrarMercadoEUA();
            proximoMercado = "brasil";
        }
    } else {
        mostrarNoticiaAtual();
    }

    /*
       Notícias e mercados permanecem pelo
       mesmo tempo: 15 segundos.
    */

    temporizadorPainel = setTimeout(
        mostrarProximoItemPainel,
        CONFIG.intervaloPainel
    );
}

function iniciarCicloPainel() {
    if (cicloPainelAtivo === true) {
        return;
    }

    cicloPainelAtivo = true;

    /*
       Sempre começa com notícias.
    */

    noticiasDesdeUltimoMercado = 0;
    proximoMercado = "brasil";

    mostrarProximoItemPainel();
}

function controlarPainelInformativo() {
    if (painelDeveFicarVisivel()) {
        iniciarCicloPainel();
    } else {
        cicloPainelAtivo = false;

        pararTemporizadorPainel();
        ocultarPainelInformativo();
    }
}

controlarPainelInformativo();

setInterval(
    controlarPainelInformativo,
    CONFIG.intervaloControlePainel
);

/* ==========================
   ATUALIZAÇÃO AUTOMÁTICA
========================== */

setInterval(function () {
    location.reload();
}, CONFIG.intervaloAtualizacaoPagina);