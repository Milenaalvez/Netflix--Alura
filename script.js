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

        // som
        som.currentTime = 0;
        som.play().catch(() => {});

        // salva perfil
        localStorage.setItem('perfil', nome);

        // efeito seleção
        document.querySelectorAll('.perfil').forEach(p => {
            p.classList.remove('selecionado');
        });

        botao.classList.add('selecionado');

        // 🔥 ANIMAÇÃO DE SAÍDA (correto agora)
        document.body.classList.add('fade-out');

        setTimeout(() => {
            window.location.href = destino;
        }, 500);
    });
});