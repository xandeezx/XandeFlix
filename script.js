const entrada = document.querySelector(".search-input");
const botao = document.querySelector(".search-button");

const tituloSérie = document.querySelector(".serie-nome");
const imagemSérie = document.querySelector(".serie-foto");
const generoTexto = document.querySelector(".serie-genero");
const notaTexto = document.querySelector(".serie-nota");
const resumoConteudo = document.querySelector(".serie-resumo");

async function buscar() {
    const nomeBusca = entrada.value;

    if (nomeBusca == "") {
        alert("Escreva o nome de alguma série!");
        return;
    }

    tituloSérie.innerHTML = "Carregando...";

    const resposta = await fetch("https://api.tvmaze.com/singlesearch/shows?q=" + nomeBusca);
    const dados = await resposta.json();

    tituloSérie.innerHTML = dados.name;
    imagemSérie.src = dados.image.medium;
    generoTexto.innerHTML = "<strong>Gênero:</strong> " + dados.genres;
    notaTexto.innerHTML = "<strong>Nota:</strong> ⭐ " + dados.rating.average;
    resumoConteudo.innerHTML = dados.summary;
}

botao.addEventListener("click", buscar);

entrada.addEventListener("keypress", function(e) {
    if (e.key == "Enter") {
        buscar();
    }
});