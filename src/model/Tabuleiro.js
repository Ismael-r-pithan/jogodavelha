class Tabuleiro {
  constructor() {
    this._casa = [{
        simbolo: null
      },
      {
        simbolo: null
      },
      {
        simbolo: null
      },
      {
        simbolo: null
      },
      {
        simbolo: null
      },
      {
        simbolo: null
      },
      {
        simbolo: null
      },
      {
        simbolo: null
      },
      {
        simbolo: null
      },
    ];
  }
  getCasa(index) {
    return this._casa[index];
  }
  setCasa(index, simbolo) {
    this._casa[index].simbolo = simbolo;
  }
  get casa() {
    return this._casa;
  }
  ehFimDeJogo() {
    const matches = ["XXX", "OOO"];
    const firstNull = this._casa.findIndex((cell) => cell.simbolo == null);
    if (firstNull == -1) {
      return {
        fimDeJogo: true,
        vencedor: null
      };
    }
    const condicoesParaVencer = [
      this.casa[0].simbolo + this.casa[1].simbolo + this.casa[2].simbolo,
      this.casa[3].simbolo + this.casa[4].simbolo + this.casa[5].simbolo,
      this.casa[6].simbolo + this.casa[7].simbolo + this.casa[8].simbolo,
      this.casa[0].simbolo + this.casa[3].simbolo + this.casa[6].simbolo,
      this.casa[1].simbolo + this.casa[4].simbolo + this.casa[7].simbolo,
      this.casa[2].simbolo + this.casa[5].simbolo + this.casa[8].simbolo,
      this.casa[0].simbolo + this.casa[4].simbolo + this.casa[8].simbolo,
      this.casa[6].simbolo + this.casa[4].simbolo + this.casa[2].simbolo,
    ];
    const condicaoParaVencer = condicoesParaVencer.find((condition) => {
      return condition == matches[0] || condition == matches[1];
    });
    if (condicaoParaVencer) {
      return {
        fimDeJogo: true,
        vencedor: condicaoParaVencer == matches[0] ? "X" : "O",
      };
    }
    return {
      fimDeJogo: false,
      vencedor: null
    };
  }
  reset() {
    this._casa.forEach((cell) => (cell.simbolo = null));
  }
}
export default Tabuleiro;