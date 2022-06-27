class Jogador {
  constructor(nome, simbolo, socketId) {
    this._nome = nome;
    this._simbolo = simbolo;
    this._socketId = socketId;
  }
  get nome() {
    return this._nome;
  }
  get simbolo() {
    return this._simbolo;
  }
  set simbolo(simbolo) {
    this._simbolo = simbolo;
  }
  get socketId() {
    return this._socketId;
  }
}
export default Jogador;
