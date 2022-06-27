import http from "http";
import express from "express";
import socketIo from "socket.io";
import Jogador from "./src/model/Jogador.js";
import Jogo from "./src/model/Jogo.js";

const app = express();

const server = http.Server(app).listen(3000);
const io = socketIo(server);
const jogadores = {};

app.use(express.static("./public"));
app.use("/vendor", express.static("./node_modules"));

app.get("/", (req, res) => {
  return res.redirect("index.html");
});

app.use("*", (req, res) => {
  return res.redirect("/index.html");
})

const jogos = {};
let partida = null;

io.on("connection", (socket) => {
  let id = socket.id;
  jogadores[id] = socket;

  socket.on("comecar.jogo", function (data) {
    const jogo = join(socket, data);
    if (jogo.jogador2) {
      jogadores[jogo.jogador1.socketId].emit("comecar.jogo", jogo);
      jogadores[jogo.jogador2.socketId].emit("comecar.jogo", jogo);
    }
  });

  socket.on("fazer.movimento", function (data) {
    const jogo = jogos[socket.id];
    jogo.tabuleiro.setCasa(data.position, data.simbolo);
    jogo.verificaFimDeJogo();
    jogo.mudarTurno();
    const event = jogo.fimDeJogo ? "jogoover" : "movimento.feito";
    jogadores[jogo.jogador1.socketId].emit(event, jogo);
    jogadores[jogo.jogador2.socketId].emit(event, jogo);
  });

  socket.on("jogo.reset", function (data) {
    const jogo = jogos[socket.id]
    if (!jogo) return
    jogo.tabuleiro.reset()
    jogadores[jogo.jogador1.socketId].emit("comecar.jogo", jogo);
    jogadores[jogo.jogador2.socketId].emit("comecar.jogo", jogo);
  })

  socket.on("disconnect", function () {
    const jogo = jogos[socket.id];
    if (jogo) {
      const socketEmit =
        jogo.jogador1.socketId == socket.id
          ? jogadores[jogo.jogador2.socketId]
          : jogadores[jogo.jogador1.socketId];

      if (socketEmit) {
        socketEmit.emit("oponente.abandonou");
      }

      delete jogos[socket.id];
      delete jogos[socketEmit.id];
    }
    delete jogadores[id];
  });
});

const join = (socket, data) => {
  const jogador = new Jogador(data.nomeJogador, "X", socket.id);

  if (partida) {
    partida.jogador2 = jogador;
    jogos[partida.jogador1.socketId] = partida;
    jogos[partida.jogador2.socketId] = partida;
    partida = null;
    return jogos[socket.id];
  } else {
    partida = new Jogo(jogador);
    return partida;
  }
};
