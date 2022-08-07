const mongoose = require('mongoose')
const validator = require('validator')
const cripty = require('bcryptjs')

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  senha: { type: String, require: true },
})

const LoginModel = mongoose.model('Login', LoginSchema)

class Login {
  constructor(body) {
    this.body = body
    this.errors = []
    this.user = null
  }

  async logging() {
    this.valida()
    if (this.errors.length > 0) return

    this.user = await LoginModel.findOne({ email: this.body.email })
    if (!this.user) {
      this.errors.push('Usuario não cadastrado')
    }
    if (this.errors.length > 0) return

    if (!cripty.compareSync(this.body.senha, this.user.senha)) {
      this.user = null
      this.errors.push('Senha incorreta IMPOSTOOOoOOOR!!!!! XD')
    }
    if (this.errors.length > 0) return

    return
  }

  async register() {
    this.valida()

    if (this.errors.length > 0) return
    await this.userExists()
    if (this.errors.length > 0) return

    const salt = cripty.genSaltSync()
    this.body.senha = cripty.hashSync(this.body.senha, salt)
    this.user = await LoginModel.create(this.body)
  }

  async userExists() {
    this.user = await LoginModel.findOne({ email: this.body.email })
    if (this.user) this.errors.push('Email ja cadastrado')
  }

  valida() {
    this.cleanUp()
    if (!validator.isEmail(this.body.email)) {
      this.errors.push('E-mail inválido')
    }
  }

  cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== 'string') {
        this.body[key] = ''
      }
    }

    this.body = {
      email: this.body.email,
      senha: this.body.senha,
    }
  }
}

module.exports = Login

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
