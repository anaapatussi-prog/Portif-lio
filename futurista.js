(() => {
  'use strict';
  const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const frases = [
    'Engenharia de Software',
    'Eletrônica & Hardware',
    'Desenvolvimento Web',
    'Pesquisa Científica',
    'Inteligência Artificial'
  ];
  const texto = document.getElementById('texto-digitado');
  if (texto) {
    if (reduzMovimento) {
      texto.textContent = frases[0];
    } else {
      let frase = 0, posicao = frases[0].length, apagando = false;
      const digitar = () => {
        const atual = frases[frase];
        if (!apagando && posicao < atual.length) {
          posicao++;
          texto.textContent = atual.slice(0, posicao);
          setTimeout(digitar, 65);
        } else if (!apagando) {
          apagando = true;
          setTimeout(digitar, 1700);
        } else if (posicao > 0) {
          posicao--;
          texto.textContent = atual.slice(0, posicao);
          setTimeout(digitar, 35);
        } else {
          frase = (frase + 1) % frases.length;
          apagando = false;
          setTimeout(digitar, 280);
        }
      };
      setTimeout(digitar, 1700);
    }
  }
  const trilhas = [...document.querySelectorAll('.trilha-energia')];
  const pontos = [...document.querySelectorAll('.ponto-circuito')];
  if (!trilhas.length) return;
  let agendado = false;
  function atualizar() {
    const maximo = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progresso = Math.min(1, Math.max(0, window.scrollY / maximo));
    trilhas.forEach((trilha, indice) => {
      const comprimento = trilha.getTotalLength();
      if (reduzMovimento) {
        trilha.style.strokeDasharray = `${comprimento} ${comprimento}`;
        trilha.style.strokeDashoffset = '0';
      } else {
        trilha.style.strokeDasharray = `${Math.max(1, comprimento * progresso)} ${comprimento}`;
        trilha.style.strokeDashoffset = indice === 0 ? '0' : String(-comprimento * .025);
      }
    });
    pontos.forEach((ponto, indice) => {
      ponto.style.opacity = reduzMovimento ? '1' : String(.2 + .8 * Math.min(1, progresso * 5 + (indice % 3) * .14));
    });
    agendado = false;
  }
  function solicitarAtualizacao() {
    if (!agendado) { agendado = true; requestAnimationFrame(atualizar); }
  }
  window.addEventListener('scroll', solicitarAtualizacao, {passive:true});
  window.addEventListener('resize', solicitarAtualizacao);
  atualizar();
})();
