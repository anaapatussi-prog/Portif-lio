(() => {
    const body = document.body;

    const btnTema = document.getElementById('tema');

    function aplicarTema(escuro) {
        body.classList.toggle('dark', escuro);
        btnTema.textContent = escuro ? '☀️' : '🌙';
        btnTema.setAttribute('aria-pressed', String(escuro));
    }

    let salvo = null;
    try { salvo = localStorage.getItem('tema'); } catch (e) {}
    aplicarTema(salvo ? salvo === 'dark' : false);

    btnTema.addEventListener('click', () => {
        const escuro = !body.classList.contains('dark');
        aplicarTema(escuro);
        try { localStorage.setItem('tema', escuro ? 'dark' : 'light'); } catch (e) {}
    });

    document.querySelectorAll('[role="tablist"]').forEach(lista => {
        const abas = [...lista.querySelectorAll('[role="tab"]')];

        function ativar(aba, foco) {
            abas.forEach(a => {
                const ativa = a === aba;
                a.setAttribute('aria-selected', String(ativa));
                a.tabIndex = ativa ? 0 : -1;
                a.classList.toggle('ativo', ativa);
                document.getElementById(a.getAttribute('aria-controls')).hidden = !ativa;
            });
            if (foco) aba.focus();
        }

        abas.forEach((aba, i) => {
            aba.addEventListener('click', () => ativar(aba));
            aba.addEventListener('keydown', e => {
                const prox = ['ArrowRight', 'ArrowDown'], ant = ['ArrowLeft', 'ArrowUp'];
                if (prox.includes(e.key)) { e.preventDefault(); ativar(abas[(i + 1) % abas.length], true); }
                else if (ant.includes(e.key)) { e.preventDefault(); ativar(abas[(i - 1 + abas.length) % abas.length], true); }
                else if (e.key === 'Home') { e.preventDefault(); ativar(abas[0], true); }
                else if (e.key === 'End') { e.preventDefault(); ativar(abas[abas.length - 1], true); }
            });
        });
    });

    const barra = document.getElementById('progresso');

    function atualizarBarra() {
        const total = document.documentElement.scrollHeight - innerHeight;
        barra.style.width = (total > 0 ? (scrollY / total) * 100 : 0) + '%';
    }
    addEventListener('scroll', atualizarBarra, { passive: true });
    addEventListener('resize', atualizarBarra);
    atualizarBarra();

    document.getElementById('imprimir').addEventListener('click', () => print());
})();
