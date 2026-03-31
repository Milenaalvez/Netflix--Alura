/* ================= LOADER ================= */
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');

    setTimeout(() => {
        loader.classList.add('hidden');
    }, 800);
});

/* ================= TEMA ================= */
const botaoTema = document.getElementById('toggleTema');

// carregar tema salvo
if (localStorage.getItem('tema') === 'light') {
    document.body.classList.add('light');
    botaoTema.textContent = '☀️';
}

botaoTema.addEventListener('click', () => {
    document.body.classList.toggle('light');

    const modoLight = document.body.classList.contains('light');

    botaoTema.textContent = modoLight ? '☀️' : '🌙';

    localStorage.setItem('tema', modoLight ? 'light' : 'dark');
});

/* ================= SOM ================= */
const som = document.getElementById('clickSound');

/* ================= PERFIS ================= */
document.querySelectorAll('.perfil').forEach(botao => {
    botao.addEventListener('click', () => {

        const nome = botao.querySelector('figcaption').innerText;
        const destino = botao.getAttribute('data-link');

        som.currentTime = 0;
        som.play();

        localStorage.setItem('perfil', nome);

        document.querySelectorAll('.perfil').forEach(p => {
            p.classList.remove('selecionado');
        });

        botao.classList.add('selecionado');

        setTimeout(() => {
            window.location.href = destino;
        }, 600);
    });
});