const app = new Vue({
  el: "#app",
  data: {
    socket: null,
    jogo: null,
    meuTurno: null,
    simbolo: null,
    nomeJogador: null,
    mensagem: "",
    blockRegister: false
  },
  methods: {
    startJogo() {
      this.mensagem = "Aguardando vitima...";
      this.blockRegister = true;
      this.socket.emit("comecar.jogo", {
        nomeJogador: this.nomeJogador,
      });
    },
    renderTurnMessage() {
      this.mensagem = this.meuTurno
        ? "Sua vez.."
        : "Aguarde sua vez..";
    },

    makeMove(cell) {
      if (!this.meuTurno || cell.simbolo !== null) return;
      this.socket.emit("fazer.movimento", {
        simbolo: this.simbolo,
        position: this.jogo._tabuleiro._casa.indexOf(cell),
      });
    },

    resetJogo() {
      this.socket.emit("jogo.reset");
    },
  },
  mounted() {
    this.socket = io.connect(window.location.origin);

    const self = this;

    this.socket.on("comecar.jogo", function (data) {
      self.jogo = data;
      const myJogador =
        data._jogador1._socketId == self.socket.id
          ? data._jogador1
          : data._jogador2;

      self.simbolo = myJogador._simbolo;
      self.meuTurno = data._turno == self.simbolo;
      self.renderTurnMessage();
    });

    this.socket.on("movimento.feito", (data) => {
      self.jogo = data;
      self.meuTurno = data._turno == self.simbolo;
      self.renderTurnMessage();
    });

    this.socket.on("jogoover", function (data) {
      self.jogo = data;
      self.meuTurno = false;
      if (self.jogo._vencedor) {
        self.mensagem =
          self.jogo._vencedor == self.simbolo ? "Você é um DEUS do jogo da velha!!" : "Você envergonhou seus ancestrais...";
      } else {
        self.mensagem = "EMPATE";
      }
    });

    this.socket.on("oponente.abandonou", function () {
      self.jogo = null;
      self.blockRegister = false;
      self.mensagem = "Seu adversário saiu correndo..";
    });
  },
});
