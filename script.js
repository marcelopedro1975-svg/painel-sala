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

var indice = 0;
document.getElementById("cidade").innerHTML = CONFIG.cidade;
function preCarregarProximaFoto() {
    var proximoIndice = indice + 1;

    if (proximoIndice >= fotos.length) {
        proximoIndice = 0;
    }

    var img = new Image();
    img.src = fotos[proximoIndice];
}
function mostrarFoto() {

    var imagem = new Image();

    imagem.onload = function () {

        proximoSlide.style.webkitAnimation = "none";
        proximoSlide.style.animation = "none";

        proximoSlide.style.backgroundImage =
            "url('" + fotos[indice] + "')";

        proximoSlide.offsetHeight;

        proximoSlide.style.webkitAnimation = "kenburns 30s linear infinite alternate";
        proximoSlide.style.animation = "kenburns 30s linear infinite alternate";

        proximoSlide.className = "slide ativo";
        slideAtual.className = "slide";

        var temporario = slideAtual;
        slideAtual = proximoSlide;
        proximoSlide = temporario;

        indice++;

        if (indice >= fotos.length) {
            indice = 0;
        }

        preCarregarProximaFoto();
    };

    imagem.src = fotos[indice];
}

mostrarFoto();
preCarregarProximaFoto();
setInterval(mostrarFoto, CONFIG.intervaloFotos);

function atualizarHora() {
    var agora = new Date();

    document.getElementById("hora").innerHTML =
        agora.toLocaleTimeString("pt-BR");

    document.getElementById("data").innerHTML =
        agora.toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
}

atualizarHora();
setInterval(atualizarHora, 1000);

function atualizarTemperatura() {
    var xhr = new XMLHttpRequest();

    xhr.open(
        "GET",
        "https://api.open-meteo.com/v1/forecast?latitude=" + CONFIG.latitude + "&longitude=" + CONFIG.longitude + "&current=temperature_2m,weather_code", true
    );

    xhr.onload = function () {
        if (xhr.status === 200) {
            var dados = JSON.parse(xhr.responseText); var codigo = dados.current.weather_code;

            document.getElementById("iconeClima").innerHTML =
                obterIconeClima(codigo);

            document.getElementById("temperatura").innerHTML =
                Math.round(dados.current.temperature_2m) + "°C";
        } else {
            document.getElementById("temperatura").innerHTML = "--°";
        }
    };

    xhr.onerror = function () {
        document.getElementById("temperatura").innerHTML = "--°";
    };

    xhr.send();
}

function obterIconeClima(codigo) {

    if (codigo === 0)
        return "☀️";

    if (codigo === 1 || codigo === 2)
        return "🌤️";

    if (codigo === 3)
        return "☁️";

    if (codigo >= 45 && codigo <= 48)
        return "🌫️";

    if (codigo >= 51 && codigo <= 67)
        return "🌧️";

    if (codigo >= 71 && codigo <= 77)
        return "❄️";

    if (codigo >= 80 && codigo <= 82)
        return "🌦️";

    if (codigo >= 95)
        return "⛈️";

    return "🌡️";
}

atualizarTemperatura();
setInterval(atualizarTemperatura, CONFIG.intervaloClima);
