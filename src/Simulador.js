export default class Simulador {
  constructor(linhas = 50, colunas = 50) {
    // Controle da animação
    this.t0 = null; // Tempo inicial
    this.desenhoPermitido = false;
    this.camadaExibida = "a";
    this.dtUpdate = 0;
    this.ultimoUpdate = Date.now();
    this.framerateInvertido = 1 / 60;

    // Dimensões do plano
    this.LINHAS = linhas;
    this.COLUNAS = colunas;
    this.TAMANHO = 7;

    // Controle do modelo
    this.fatorDecaimento = 0.062;
    this.fatorAdicao = 0.055;
    this.fatorDifusao = { a: 1, b: 0.5 };
    this.valoresPadrao = {
      aa: "A",
      bb: "A",
      set a(x) {
        if (isNaN(x)) this.aa = x;
        else this.aa = parseInt(x);
      },
      set b(x) {
        if (isNaN(x)) this.bb = x;
        else this.bb = parseInt(x);
      },
      get a() {
        if (typeof this.aa === "number") return this.aa;
        else return Math.random();
      },
      get b() {
        if (typeof this.bb === "number") return this.bb;
        else return Math.random();
      },
    };
    this.valoresPadrao.a = "A";
    this.valoresPadrao.b = "A";
    this.intensidadeMaxima = { a: 1, b: 1 };

    this.inicializarComValoresPadrao();
  }

  inicializarComValoresPadrao() {
    this.plano = [];
    this.planoFuturo = [];
    // Preenche o plano com valores aleatórios
    for (let l = 0; l < this.LINHAS; l++) {
      this.plano[l] = [];
      this.planoFuturo[l] = [];
      for (let c = 0; c < this.COLUNAS; c++) {
        const celulaPlano = {
          a: this.valoresPadrao.a,
          b: this.valoresPadrao.b,
        }; // Número aleatório entre 0 e 0.999...
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
      this.plano[l][c][this.camadaExibida]++;
    }
  }

  doAnimationStep(ctx, t) {
    if (this.t0 === null) {
      this.t0 = t;
    }
    let dt = (t - this.t0) / 1000; // Intervalo entre tempo atual e anterior
    if (dt > 3 / 60) {
      console.log("dt too long: " + dt, "t0: " + this.t0, "t: " + t);
      dt = 0.0;
      this.t0 = t;
      return;
    }

    const agora = Date.now();
    this.dtUpdate += (agora - this.ultimoUpdate) / 1000;
    this.ultimoUpdate = agora;

    while (this.dtUpdate >= this.framerateInvertido) {
      this.update(ctx, dt);
      this.dtUpdate -= this.framerateInvertido;
    }

    this.draw(ctx, dt);
    // Define tempo inicial da próxima animação como o tempo atual
    this.t0 = t;
  }

  // Atualiza o estado
  update(ctx, dt) {
    // Calcula reação
    this.reacao(this.plano, this.planoFuturo, dt);
    // Troca de estado
    const aux = this.plano;
    this.plano = this.planoFuturo;
    this.planoFuturo = aux;
  }

  // Desenha na tela
  draw(ctx, dt) {
    const somaIntensidade = { a: 0, b: 0 };
    let intensidadeMaxInst = { a: 0, b: 0 };

    // Limpa desenho anterior
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const infoIntMax = document.getElementById("infoIntensidadeMaxima");

    // Desenha na tela conforme os valores do plano
    intensidadeMaxInst[this.camadaExibida] = 0;
    for (let l = 0; l < this.LINHAS; l++) {
      for (let c = 0; c < this.COLUNAS; c++) {
        const intensidade = {};
        intensidade.a = this.plano[l][c].a;
        intensidade.b = this.plano[l][c].b;
        somaIntensidade.a += intensidade.a;
        somaIntensidade.b += intensidade.b;

        if (
          intensidade[this.camadaExibida] >
          intensidadeMaxInst[this.camadaExibida]
        )
          intensidadeMaxInst[this.camadaExibida] =
            intensidade[this.camadaExibida];

        ctx.fillStyle = `hsl(${
          (1 -
            intensidade[this.camadaExibida] /
              this.intensidadeMaxima[this.camadaExibida]) *
          100
        }deg, 100%, 50%)`;
        ctx.fillRect(
          c * this.TAMANHO,
          l * this.TAMANHO,
          this.TAMANHO,
          this.TAMANHO
        );
      }
    }
    // Exibe concentração total
    document.getElementById("infoFerA").textContent =
      somaIntensidade.a.toFixed(2);
    document.getElementById("infoFerB").textContent =
      somaIntensidade.b.toFixed(2);

    this.intensidadeMaxima[this.camadaExibida] =
      intensidadeMaxInst[this.camadaExibida];
    infoIntMax.textContent =
      this.intensidadeMaxima[this.camadaExibida].toFixed(2);
  }

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

  reacao(plano, planoFuturo, dt) {
    for (let l = 0; l < this.LINHAS; l++) {
      for (let c = 0; c < this.COLUNAS; c++) {
        const intensidade = {};
        intensidade.a = this.plano[l][c].a;
        intensidade.b = this.plano[l][c].b;
        const intensidadeAFutura =
          intensidade.a +
          (this.fatorDifusao["a"] *
            this.calculaAcrescimoIntensidade(plano, l, c, "a") -
            intensidade.a * intensidade.b * intensidade.b +
            this.fatorAdicao * (1 - intensidade.a)) *
            dt;
        const intensidadeBFutura =
          intensidade.b +
          (this.fatorDifusao["b"] *
            this.calculaAcrescimoIntensidade(plano, l, c, "b") +
            intensidade.a * intensidade.b * intensidade.b -
            (this.fatorDecaimento + this.fatorAdicao) * intensidade.b) *
            dt;
        if (intensidadeAFutura > 0) planoFuturo[l][c].a = intensidadeAFutura;
        else planoFuturo[l][c].a = 0;
        if (intensidadeBFutura > 0) planoFuturo[l][c].b = intensidadeBFutura;
        else planoFuturo[l][c].b = 0;
      }
    }
  }

  mudarTamanho(linhas, colunas, tamanho) {
    this.LINHAS = linhas;
    this.COLUNAS = colunas;
    this.TAMANHO = tamanho;
    this.inicializarComValoresPadrao();
  }
}
