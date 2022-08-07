const mongoose = require("mongoose");
//criando esquema = Shema
const HomeSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descricao: String,
});

//Criando modelo = model
const HomeModel = mongoose.model("Home", HomeSchema);

/** CRIANDO DADO */
// HomeModel.create({
//   titulo: "O dolly",
//   descricao: "O dolly é o Dolly o dolly sabe que o dolly descricao",
// })
//  Vai retornar uma promise
//   .then((dados) => console.log(dados))
//   .catch((e) => console.log(e));

/**  BUSCANDO DADOS */
//  HomeModel.find({titulo: "O dolly"})
//  Vai retornar uma promise
//   .then((dados) => console.log(dados))
//   .catch((e) => console.log(e));

class Home {}

module.exports = Home;
