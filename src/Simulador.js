export default class Simulador {
  constructor(linhas = 50, colunas = 50) {
    this.t0 = null; // Tempo inicial
    this.desenhoPermitido = false;
    // Controle de animação
    this.animacaoPermitida = true;

    // Dimensões do plano
    this.LINHAS = linhas;
    this.COLUNAS = colunas;
    this.TAMANHO = 10;
    
    // Controle do modelo
    this.fatorDecaimento = 0.062;
    this.fatorAdicao = 0.055;
    this.fatorDifusao = { a: 1, b: 0.5 };
    
    // Referências de elementos
    this.infoA = null;
    this.infoB = null;

    this.inicializarComAleatorios();
  }

  inicializarComAleatorios() {
    this.plano = [];
    this.planoFuturo = [];
    // Preenche o plano com valores aleatórios
    for (let l = 0; l < this.LINHAS; l++) {
      this.plano[l] = [];
      this.planoFuturo[l] = [];
      for (let c = 0; c < this.COLUNAS; c++) {
        const celulaPlano = { a: Math.random(), b: Math.random() }; // Número aleatório entre 0 e 0.999...
        const celulaPlanoFuturo = { a: 0, b: 0 };
        this.plano[l][c] = celulaPlano;
        this.planoFuturo[l][c] = celulaPlanoFuturo;
      }
    }
  }

  depositaIntensidade(e) {
    const canvas = e.target;
    const caixa = canvas.getBoundingClientRect();
    const escalaX = canvas.width / caixa.width;
    const escalaY = canvas.height / caixa.height;
    const x = (e.clientX - caixa.x) * escalaX;
    const y = (e.clientY - caixa.top) * escalaY;
    const l = Math.floor(y / this.TAMANHO);
    const c = Math.floor(x / this.TAMANHO);
    if (l >= 0 && l < this.LINHAS && c >= 0 && c < this.COLUNAS) {
      this.plano[l][c].a = 1;
    }
  }


  // Desenha na tela
  draw(ctx, t) {
    if (this.t0 === null) {
      this.t0 = t;
    }
    let dt = (t - this.t0) / 1000; // Intervalo entre tempo atual e anterior
    if (!this.animacaoPermitida) { dt = 0; }

    // Limpa desenho anterior
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    let somaIntensidadeA = 0;
    let somaIntensidadeB = 0;
    // Desenha na tela conforme os valores do plano
    for (let l = 0; l < this.LINHAS; l++) {
      for (let c = 0; c < this.COLUNAS; c++) {
        let intensidadeA = this.plano[l][c].a;
        let intensidadeB = this.plano[l][c].b;
        somaIntensidadeA += intensidadeA;
        somaIntensidadeB += intensidadeB;

        ctx.fillStyle = `hsla(${(1 - intensidadeA) * 100}deg, 100%, 50%, 50%)`;
        ctx.fillRect(c * this.TAMANHO, l * this.TAMANHO, this.TAMANHO, this.TAMANHO);
        ctx.fillStyle = `hsla(${(1 - intensidadeA) * 100}deg, 100%, 50%, 50%)`;
        ctx.fillRect(c * this.TAMANHO, l * this.TAMANHO, this.TAMANHO, this.TAMANHO);
      }
    }
    // Exibe concentração total
    document.getElementById("infoFerA").innerText = somaIntensidadeA.toFixed(2);
    document.getElementById("infoFerB").innerText = somaIntensidadeB.toFixed(2);

    // Difusão da concentração
    this.difusao(this.plano, this.planoFuturo, dt);

    // Troca de estado
    const aux = this.plano;
    this.plano = this.planoFuturo;
    this.planoFuturo = aux;

    // Define tempo inicial da próxima animação como o tempo atual
    this.t0 = t;
  };

  calculaAcrescimoIntensidade(plano, l, c, feromonio) {
    let pesoOrtog = 0.2;
    let pesoDiag = 0.05;
    let remocao = 0;

    let intensidadeRedor = 0;
    if (l - 1 >= 0) {
      intensidadeRedor += plano[l - 1][c][feromonio] * pesoOrtog;
      remocao += pesoOrtog;
    }
    if (l + 1 < this.LINHAS) {
      intensidadeRedor += plano[l + 1][c][feromonio] * pesoOrtog;
      remocao += pesoOrtog;
    }
    if (c - 1 >= 0) {
      intensidadeRedor += plano[l][c - 1][feromonio] * pesoOrtog;
      remocao += pesoOrtog;
    }
    if (c + 1 < this.COLUNAS) {
      intensidadeRedor += plano[l][c + 1][feromonio] * pesoOrtog;
      remocao += pesoOrtog;
    }
    if (l - 1 >= 0 && c - 1 >= 0) {
      intensidadeRedor += plano[l - 1][c - 1][feromonio] * pesoDiag;
      remocao += pesoDiag;
    }
    if (l - 1 >= 0 && c + 1 < this.COLUNAS) {
      intensidadeRedor += plano[l - 1][c + 1][feromonio] * pesoDiag;
      remocao += pesoDiag;
    }
    if (l + 1 < this.LINHAS && c - 1 >= 0) {
      intensidadeRedor += plano[l + 1][c - 1][feromonio] * pesoDiag;
      remocao += pesoDiag;
    }
    if (l + 1 < this.LINHAS && c + 1 < this.COLUNAS) {
      intensidadeRedor += plano[l + 1][c + 1][feromonio] * pesoDiag;
      remocao += pesoDiag;
    }
    intensidadeRedor += plano[l][c][feromonio] * -1 * remocao;

    return intensidadeRedor;
  }

  difusao(plano, planoFuturo, dt) {
    for (let l = 0; l < this.LINHAS; l++) {
      for (let c = 0; c < this.COLUNAS; c++) {
        const intensidadeA = plano[l][c].a;
        const intensidadeB = plano[l][c].b;
        const intensidadeAFutura =
          intensidadeA +
          (this.fatorDifusao["a"] * this.calculaAcrescimoIntensidade(plano, l, c, "a") -
            intensidadeA * intensidadeB * intensidadeB +
            this.fatorAdicao * (1 - intensidadeA)) *
          dt;
        const intensidadeBFutura =
          intensidadeB +
          (this.fatorDifusao["b"] * this.calculaAcrescimoIntensidade(plano, l, c, "b") +
            intensidadeA * intensidadeB * intensidadeB -
            (this.fatorDecaimento + this.fatorAdicao) * intensidadeB) *
          dt;
        if (intensidadeAFutura > 0) planoFuturo[l][c].a = intensidadeAFutura;
        else planoFuturo[l][c].a = 0;
        if (intensidadeBFutura > 0) planoFuturo[l][c].b = intensidadeBFutura;
        else planoFuturo[l][c].b = 0;
      }
    }
  }

  mudarTamanho(linhas, colunas) {
    this.LINHAS = linhas;
    this.COLUNAS = colunas;
    this.inicializarComAleatorios();
  }
}