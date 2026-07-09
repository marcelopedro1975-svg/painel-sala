var fotos = [
    "fotos/IMG_20250511_123636.jpg",
    "fotos/IMG_20260403_114501.jpg",
    "fotos/IMG-20250509-WA0308.jpg",
    "fotos/IMG-20250612-WA0226.jpg",
    "fotos/IMG-20250612-WA0235.jpg"
];

var slide = document.getElementById("slideshow");
var indice = 0;

function mostrarFoto() {

    slide.style.opacity = 0;

    setTimeout(function () {

        slide.style.backgroundImage =
            "url('" + fotos[indice] + "')";

        slide.style.opacity = 1;

        indice++;

        if (indice >= fotos.length) {

            indice = 0;

        }

    }, 1500);

}

mostrarFoto();
setInterval(mostrarFoto, 5000);

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
        "https://api.open-meteo.com/v1/forecast?latitude=-23.5505&longitude=-46.6333&current=temperature_2m,weather_code", true
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
setInterval(atualizarTemperatura, 1800000);
