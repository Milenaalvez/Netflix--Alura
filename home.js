/* ================= CONFIG ================= */
const API_KEY = "e88ee99ce3e8b8a7fbe86ec27492dde2";
const IMG = "https://image.tmdb.org/t/p/original";

/* ================= ELEMENTOS ================= */
const linhas = document.getElementById("linhas");
const pesquisa = document.getElementById("pesquisa");

/* ================= PERFIL ================= */
const nome = localStorage.getItem("perfil");
const imgPerfil = localStorage.getItem("perfilImg");

if (nome && imgPerfil) {
    const nomeEl = document.getElementById("perfilNome");
    const imgEl = document.getElementById("perfilImg");

    if (nomeEl && imgEl) {
        nomeEl.textContent = nome;
        imgEl.src = imgPerfil;
    }
}

/* ================= CRIAR LINHA ================= */
function criarLinha(titulo, endpoint) {
    fetch(`https://api.themoviedb.org/3/movie/${endpoint}?api_key=${API_KEY}&language=pt-BR`)
        .then(res => res.json())
        .then(data => {

            const filmes = data.results.filter(f => f.poster_path);

            const linha = document.createElement("div");
            linha.classList.add("linha");

            linha.innerHTML = `
                <h3>${titulo}</h3>

                <span class="seta esquerda">❮</span>

                <div class="carrossel">
                    ${filmes.map(f => `
                        <img src="${IMG}${f.poster_path}" 
                         data-filme='${encodeURIComponent(JSON.stringify(f))}'
                         class="filme">
                    `).join("")}
                </div>

                <span class="seta direita">❯</span>
            `;

             linhas.appendChild(linha);

             document.addEventListener("click", (e) => {
            const img = e.target.closest(".filme");

             if (!img) return;

            const filme = JSON.parse(decodeURIComponent(img.dataset.filme));
    abrirModal(filme);
});

            // movimento das setas
            const carrossel = linha.querySelector(".carrossel");
            const esquerda = linha.querySelector(".esquerda");
            const direita = linha.querySelector(".direita");

           direita.onclick = () => {
    carrossel.scrollBy({
        left: window.innerWidth * 0.8,
        behavior: "smooth"
    });
};

esquerda.onclick = () => {
    carrossel.scrollBy({
        left: -window.innerWidth * 0.8,
        behavior: "smooth"
    });
};

        });
}
/* ================= INÍCIO ================= */
window.carregarInicio = function() {
    linhas.innerHTML = "";

    criarLinha("🔥 Populares", "popular");
    criarLinha("⭐ Mais avaliados", "top_rated");
    criarLinha("🎬 Em breve", "upcoming");
}

carregarInicio();
carregarBanner();

/* ================= PESQUISA ================= */
if (pesquisa) {
    pesquisa.addEventListener("input", () => {
        const valor = pesquisa.value.trim();

        if (!valor) {
            carregarInicio();
            return;
        }

        fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${valor}`)
            .then(res => res.json())
            .then(data => {

                const filmes = data.results.filter(f => f.poster_path);

                linhas.innerHTML = `
                    <h3>🔎 Resultados</h3>
                    <div class="carrossel">
                        ${filmes.map(f => `
                            <img src="${IMG}${f.poster_path}" 
                            onclick='abrirModal(${JSON.stringify(f)})'>
                        `).join("")}
                    </div>
                `;
            });
    });
}

/* ================= BOTÃO HOME ================= */
const btnHome = document.getElementById("btnHome");

if (btnHome) {
    btnHome.onclick = () => {
        carregarInicio();
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
}

/* ================= BUSCA 🔍 ================= */
const abrirBusca = document.getElementById("abrirBusca");

if (abrirBusca && pesquisa) {
    abrirBusca.onclick = () => {
        pesquisa.classList.toggle("hidden");
        pesquisa.focus();
    };
}

/* ================= TEMA 🌙 ================= */
const botaoTema = document.getElementById("toggleTema");

if (botaoTema) {

    if (localStorage.getItem('tema') === 'light') {
        document.body.classList.add('light');
        botaoTema.textContent = '☀️';
    }

    botaoTema.onclick = () => {
        document.body.classList.toggle('light');

        const light = document.body.classList.contains('light');
        botaoTema.textContent = light ? '☀️' : '🌙';

        localStorage.setItem('tema', light ? 'light' : 'dark');
    };
}

/* ================= MODAL ================= */
let filmeAtual = null;

function abrirModal(filme) {
    filmeAtual = filme;

    const imagem = document.getElementById("modal-img");

    const imagemURL = filme.backdrop_path 
        ? `https://image.tmdb.org/t/p/original${filme.backdrop_path}`
        : `https://image.tmdb.org/t/p/original${filme.poster_path}`;

    imagem.src = imagemURL;

    document.getElementById("modal-titulo").textContent = filme.title;
    document.getElementById("modal-desc").textContent = filme.overview;

    document.getElementById("modal").style.display = "flex";

    // RESET
    document.getElementById("modal-img").style.display = "block";
    document.getElementById("modal-img").style.opacity = "1";
    document.getElementById("trailer-container").style.display = "none";

    const video = document.getElementById("trailer-video");
    if (video) video.src = "";

    // 🔥🔥🔥 AQUI (AUTOPLAY APÓS 3s)
    setTimeout(() => {
        if (filmeAtual === filme) {
            abrirTrailerModal(filme);
        }
    }, 3000);
}

/* ================= BANNER ================= */
function carregarBanner() {
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=pt-BR`)
        .then(res => res.json())
        .then(data => {

            const filmes = data.results.filter(f => f.backdrop_path);
            const filme = filmes[Math.floor(Math.random() * filmes.length)];

            filmeBannerAtual = filme; // ✅ AQUI É O LUGAR CERTO

            document.getElementById("banner").style.backgroundImage =
                `url(https://image.tmdb.org/t/p/original${filme.backdrop_path})`;

            document.getElementById("banner-titulo").textContent = filme.title;
            document.getElementById("banner-desc").textContent = filme.overview;
        });
}


/* ================= CATEGORIA MENU ================= */
window.carregarCategoria = function(tipo) {
    linhas.innerHTML = "";

    if (tipo === "popular") {
        criarLinha("🔥 Populares", "popular");
    }

    if (tipo === "top_rated") {
        criarLinha("⭐ Mais avaliados", "top_rated");
    }

    if (tipo === "upcoming") {
        criarLinha("🎬 Em breve", "upcoming");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
}


/* ================= BOTÃO MAIS INFO ================= */

const btnInfo = document.querySelector(".btn-info");

if (btnInfo) {
    btnInfo.onclick = () => {
        if (filmeBannerAtual) {
            abrirModal(filmeBannerAtual);
        }
    };
}
function abrirTrailer(filme) {
    fetch(`https://api.themoviedb.org/3/movie/${filme.id}/videos?api_key=${API_KEY}`)
        .then(res => res.json())
        .then(data => {

            const trailer = data.results.find(v => v.type === "Trailer" && v.site === "YouTube");

            if (!trailer) {
             console.log("Sem trailer...");
            return;
}

            const url = `https://www.youtube.com/watch?v=${trailer.key}`;

            window.open(url, "_blank"); // 🔥 abre em nova aba
        });
}

document.addEventListener("click", (e) => {
    const botao = e.target.closest(".btn-play-modal");

    if (botao && filmeAtual) {
        abrirTrailerModal(filmeAtual);
    }
});

function abrirTrailerModal(filme) {
    fetch(`https://api.themoviedb.org/3/movie/${filme.id}/videos?api_key=${API_KEY}`)
        .then(res => res.json())
        .then(data => {

            let trailer = data.results.find(v => 
                v.type === "Trailer" && v.site === "YouTube"
            );

            if (!trailer) {
                trailer = data.results.find(v => v.site === "YouTube");
            }

            if (!trailer) {
                console.log("Sem trailer, mantendo imagem...");

                const iframe = document.getElementById("trailer-video");
                if (iframe) iframe.src = "";

                document.getElementById("modal-img").style.display = "block";
                document.getElementById("trailer-container").style.display = "none";

                return;
            }

            const iframe = document.getElementById("trailer-video");

            iframe.src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1`;

            // 🔥 TRANSIÇÃO SUAVE
            const img = document.getElementById("modal-img");

            img.style.opacity = "0";

            setTimeout(() => {
                img.style.display = "none";
                document.getElementById("trailer-container").style.display = "block";
            }, 300);
        });
}

const fechar = document.getElementById("fechar");

if (fechar) {
    fechar.onclick = () => {

        document.getElementById("modal").style.display = "none";

        // 🔥 para o trailer
        const iframe = document.getElementById("trailer-video");
        if (iframe) iframe.src = "";

        // 🔥 volta imagem
        document.getElementById("modal-img").style.display = "block";
        document.getElementById("modal-img").style.opacity = "1";

        document.getElementById("trailer-container").style.display = "none";
    };
}