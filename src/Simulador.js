export default class Simulador {
  constructor(linhas = 50, colunas = 50) {
    // Controle da animação
    this.t0 = null; // Tempo inicial
    this.desenhoPermitido = false;
    this.camadaExibida = "a";
    this.dtU = 1 / 60 / 10;
    this.somaDtU = 0;

    // Dimensões do plano
    this.LINHAS = linhas;
    this.COLUNAS = colunas;
    this.TAMANHO = 7;

    // Controle do modelo
    this.fatorDecaimento = 0.062;
    this.fatorDecaimentoC = 0.01;
    this.fatorAdicao = 0.055;
    this.fatorDifusao = { a: 1, b: 0.5, c: 1 };
    this.valoresPadrao = {
      aa: "A",
      bb: "A",
      cc: "A",
      set a(x) {
        if (isNaN(x)) this.aa = x;
        else this.aa = parseInt(x);
      },
      set b(x) {
        if (isNaN(x)) this.bb = x;
        else this.bb = parseInt(x);
      },
      set c(x) {
        if (isNaN(x)) this.cc = x;
        else this.cc = parseInt(x);
      },
      get a() {
        if (typeof this.aa === "number") return this.aa;
        else return Math.random();
      },
      get b() {
        if (typeof this.bb === "number") return this.bb;
        else return Math.random();
      },
      get c() {
        if (typeof this.cc === "number") return this.cc;
        else return Math.random();
      },
    };
    this.valoresPadrao.a = "A";
    this.valoresPadrao.b = "A";
    this.valoresPadrao.c = "A";
    this.intensidadeMaxima = { a: 1, b: 1, c: 1 };

    this.canvas = 0;

    this.inicializarComValoresPadrao();
  }

  inicializarComValoresPadrao() {
    this.plano = [];
    this.planoFuturo = [];
    // Preenche o plano com valores aleatórios
    for (let linha = 0; linha < this.LINHAS; linha++) {
      this.plano[linha] = [];
      this.planoFuturo[linha] = [];
      for (let coluna = 0; coluna < this.COLUNAS; coluna++) {
        const celulaPlano = {
          a: this.valoresPadrao.a,
          b: this.valoresPadrao.b,
          c: this.valoresPadrao.c,
        }; // Número aleatório entre 0 e 0.999...
        const celulaPlanoFuturo = { a: 0, b: 0, c: 0 };
        this.plano[linha][coluna] = celulaPlano;
        this.planoFuturo[linha][coluna] = celulaPlanoFuturo;
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
    const linha = Math.floor(y / this.TAMANHO);
    const coluna = Math.floor(x / this.TAMANHO);
    if (
      linha >= 0 &&
      linha < this.LINHAS &&
      coluna >= 0 &&
      coluna < this.COLUNAS
    ) {
      this.plano[linha][coluna][this.camadaExibida]++;
    }
  }

  doAnimationStep(ctx, t) {
    if (this.t0 === null) {
      this.t0 = t;
    }
    let dtA = (t - this.t0) / 1000; // Intervalo entre tempo atual e anterior
    if (dtA > 3 / 60) {
      console.log("dt too long: " + dtA, "t0: " + this.t0, "t: " + t);
      dtA = 0.0;
      this.t0 = t;
      return;
    }

    while (this.somaDtU < dtA) {
      this.update(this.dtU);
      this.somaDtU += this.dtU;
    }

    this.somaDtU = this.somaDtU - this.dtU - dtA;

    this.draw(ctx);
    // Define tempo inicial da próxima animação como o tempo atual
    this.t0 = t;
  }

  // Atualiza o estado
  update(dt) {
    // Calcula reação
    this.reacao(this.plano, this.planoFuturo, dt);
    // Troca de estado
    const aux = this.plano;
    this.plano = this.planoFuturo;
    this.planoFuturo = aux;
  }

  // Desenha na tela
  draw(ctx) {
    ctx = ctx ?? this.canvas.getContext("2d");
    const somaIntensidade = { a: 0, b: 0, c: 0 };
    let intensidadeMaxInst = { a: 0, b: 0, c: 0 };

    // Limpa desenho anterior
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const infoIntMax = document.getElementById("infoIntensidadeMaxima");

    // Desenha na tela conforme os valores do plano
    intensidadeMaxInst[this.camadaExibida] = 0;
    for (let linha = 0; linha < this.LINHAS; linha++) {
      for (let coluna = 0; coluna < this.COLUNAS; coluna++) {
        const intensidade = {};
        intensidade.a = this.plano[linha][coluna].a;
        intensidade.b = this.plano[linha][coluna].b;
        intensidade.c = this.plano[linha][coluna].c;
        somaIntensidade.a += intensidade.a;
        somaIntensidade.b += intensidade.b;
        somaIntensidade.c += intensidade.c;

        if (
          intensidade[this.camadaExibida] >
          intensidadeMaxInst[this.camadaExibida]
        )
          intensidadeMaxInst[this.camadaExibida] =
            intensidade[this.camadaExibida];

        if (this.camadaExibida === "c") {
          ctx.fillStyle = `hsl(45deg, 100%, ${
            (intensidade[this.camadaExibida] /
              this.intensidadeMaxima[this.camadaExibida]) *
            50
          }%`;
        } else {
          ctx.fillStyle = `hsl(${
            (1 -
              intensidade[this.camadaExibida] /
                this.intensidadeMaxima[this.camadaExibida]) *
            100
          }deg, 100%, 50%)`;
        }
        ctx.fillRect(
          coluna * this.TAMANHO,
          linha * this.TAMANHO,
          this.TAMANHO,
          this.TAMANHO
        );
      }
    }

    // Exibe concentração total
    document.getElementById("infoA").textContent = somaIntensidade.a.toFixed(2);
    document.getElementById("infoB").textContent = somaIntensidade.b.toFixed(2);
    document.getElementById("infoC").textContent = somaIntensidade.c.toFixed(2);

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
    for (let linha = 0; linha < this.LINHAS; linha++) {
      for (let coluna = 0; coluna < this.COLUNAS; coluna++) {
        const intensidade = {};
        intensidade.a = this.plano[linha][coluna].a;
        intensidade.b = this.plano[linha][coluna].b;
        intensidade.c = this.plano[linha][coluna].c;
        const intensidadeAFutura =
          intensidade.a +
          (this.fatorDifusao["a"] *
            this.calculaAcrescimoIntensidade(plano, linha, coluna, "a") -
            intensidade.a * intensidade.b * intensidade.b +
            this.fatorAdicao * (1 - intensidade.a)) *
            dt;
        const intensidadeBFutura =
          intensidade.b +
          (this.fatorDifusao["b"] *
            this.calculaAcrescimoIntensidade(plano, linha, coluna, "b") +
            intensidade.a * intensidade.b * intensidade.b -
            (this.fatorDecaimento + this.fatorAdicao) * intensidade.b) *
            dt;
        const intensidadeCFutura = intensidade.c;
        if (intensidadeAFutura > 0)
          planoFuturo[linha][coluna].a = intensidadeAFutura;
        else planoFuturo[linha][coluna].a = 0;
        if (intensidadeBFutura > 0)
          planoFuturo[linha][coluna].b = intensidadeBFutura;
        else planoFuturo[linha][coluna].b = 0;
        if (intensidadeCFutura > 0)
          planoFuturo[linha][coluna].c = intensidadeCFutura;
        else planoFuturo[linha][coluna].c = 0;
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
