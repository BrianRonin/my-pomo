const mongoose = require('mongoose')
//criando esquema = Shema
const TaskHistorySchema = new mongoose.Schema({
  task: { type: String, required: true },
  minutes: { Number, default: 0 },
})

//Criando modelo = model
const HistoryTaskModel = mongoose.model('TaskHistory', TaskHistorySchema)

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

module.exports = Home
