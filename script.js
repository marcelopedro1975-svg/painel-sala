const fotos = [

"fotos/IMG_20250511_123636.jpg",
"fotos/IMG_20260403_114501.jpg",
"fotos/IMG-20250509-WA0308.jpg",
"fotos/IMG-20250612-WA0226.jpg",
"fotos/IMG-20250612-WA0235.jpg"

];

const slide = document.getElementById("slideshow");

let indice = 0;

function mostrarFoto(){

    slide.style.backgroundImage =
        "url('" + fotos[indice] + "')";

    indice++;

    if(indice>=fotos.length){

        indice=0;

    }

}

mostrarFoto();

setInterval(mostrarFoto,30000);



function atualizarHora(){

    const agora=new Date();

    document.getElementById("hora").innerHTML=
    agora.toLocaleTimeString("pt-BR");

    document.getElementById("data").innerHTML=
    agora.toLocaleDateString("pt-BR",{

        weekday:"long",

        day:"numeric",

        month:"long",

        year:"numeric"

    });

}

atualizarHora();

setInterval(atualizarHora,1000);



async function atualizarTemperatura(){

    try{

        const resposta=await fetch("https://api.open-meteo.com/v1/forecast?latitude=-23.4543&longitude=-46.5333&current=temperature_2m");

        const dados=await resposta.json();

        document.getElementById("temperatura").innerHTML=
        Math.round(dados.current.temperature_2m)+"°C";

    }

    catch{

        document.getElementById("temperatura").innerHTML="--°";

    }

}

atualizarTemperatura();

setInterval(atualizarTemperatura,1800000);