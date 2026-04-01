const entrada = document.querySelector(".search-input");
const botao = document.querySelector(".search-button");
const micBtn = document.getElementById("micBtn"); // adicionado

const tituloSerie = document.querySelector(".serie-nome");
const imagemSerie = document.querySelector(".serie-foto");
const generoTexto = document.querySelector(".serie-genero");
const notaTexto = document.querySelector(".serie-nota");
const resumoConteudo = document.querySelector(".serie-resumo");

async function buscar() {
    const nomeBusca = entrada.value.trim();

    if (nomeBusca === "") {
        alert("Escreva o nome de alguma série");
        return;
    }

    tituloSerie.innerHTML = "Carregando...";

    try {
        const resposta = await fetch("https://api.tvmaze.com/singlesearch/shows?q=" + nomeBusca);

        if (!resposta.ok) {
            throw new Error("Série não encontrada");
        }

        const dados = await resposta.json();

        tituloSerie.innerHTML = `🎬 ${dados.name} (${dados.premiered?.slice(0,4) || "Ano desconhecido"})`;

        imagemSerie.style.opacity = "0";
        imagemSerie.removeAttribute("src");

        const imgUrl = dados.image?.original || dados.image?.medium || null;

        if (imgUrl) {
            const temp = new Image();
            temp.onload = () => {
                imagemSerie.src = imgUrl;
                imagemSerie.alt = `Poster da série ${dados.name}`;
                imagemSerie.style.opacity = "1";
            };
            temp.onerror = () => {
                imagemSerie.style.display = "none";
            };
            temp.src = imgUrl;
        } else {
            imagemSerie.style.display = "none";
        }

        generoTexto.innerHTML = "<strong>Gênero:</strong> " + dados.genres.join(", ");
        notaTexto.innerHTML = "<strong>Nota:</strong> ⭐ " + (dados.rating.average || "N/A");
        resumoConteudo.innerHTML = dados.summary;

    } catch (erro) {
        tituloSerie.innerHTML = "Erro ao buscar série 😢";
        generoTexto.innerHTML = "";
        notaTexto.innerHTML = "";
        resumoConteudo.innerHTML = "";
        imagemSerie.removeAttribute("src");
    }
}

botao.addEventListener("click", buscar);

entrada.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        buscar();
    }
});


const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = "pt-BR";
    recognition.continuous = false;

    micBtn.addEventListener("click", () => recognition.start());

    recognition.onresult = (event) => {
        const fala = event.results[0][0].transcript;
        entrada.value = fala;
        buscar();
    };

    recognition.onerror = () => {
        alert("Erro ao acessar o microfone.");
    };
} else {
    micBtn.style.display = "none";
}

// PWA
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js");
}