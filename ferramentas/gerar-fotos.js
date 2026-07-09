var fs = require("fs");
var path = require("path");

var pastaProjeto = path.join(__dirname, "..");
var pastaFotos = path.join(pastaProjeto, "fotos");
var arquivoSaida = path.join(pastaProjeto, "fotos.js");

var extensoesPermitidas = [".jpg", ".jpeg", ".png"];

console.log("Lendo pasta de fotos...");

if (!fs.existsSync(pastaFotos)) {
    console.log("ERRO: pasta fotos não encontrada.");
    process.exit(1);
}

var arquivos = fs.readdirSync(pastaFotos);
var fotos = [];

for (var i = 0; i < arquivos.length; i++) {
    var nome = arquivos[i];
    var ext = path.extname(nome).toLowerCase();

    if (extensoesPermitidas.indexOf(ext) !== -1) {
        fotos.push("fotos/" + nome);
    }
}

fotos.sort();

var conteudo = "var FOTOS = [\n";

for (var j = 0; j < fotos.length; j++) {
    conteudo += "    \"" + fotos[j] + "\"";

    if (j < fotos.length - 1) {
        conteudo += ",";
    }

    conteudo += "\n";
}

conteudo += "];\n";

fs.writeFileSync(arquivoSaida, conteudo, "utf8");

console.log("");
console.log(fotos.length + " fotos encontradas.");
console.log("Arquivo fotos.js gerado com sucesso.");