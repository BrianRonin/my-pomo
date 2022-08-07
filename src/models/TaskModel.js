//const validator = require('validator')
const mongoose = require('mongoose')
//const session = require('express-session')
//criando esquema = Shema
const TaskSchema = new mongoose.Schema({
  task: {
    type: String,
    required: false,
    default: 'Qualquer coisa',
  },
  everyRealized: { type: Number, required: false, default: 0 },
  todayRealized: { type: Number, required: false, default: 0 },
  session: { type: Number, required: false, default: 0 },
  pomodories: { type: Number, required: false, default: 0 },
  isDiary: { type: Boolean, required: true, default: false },
})
const TaskModel = mongoose.model('Task', TaskSchema)

function Task(body) {
  this.body = body
  this.errors = []
  this.task = null
}

Task.prototype.register = async function () {
  this.valida()
  console.log(this.body)
  if (this.errors.length > 0) return
  if (this.body.isDiary === 'on') this.body.isDiary = true
  this.task = await TaskModel.create(this.body)
}

Task.prototype.valida = function () {
  this.cleanUp()
}

Task.prototype.cleanUp = function () {
  for (const key in this.body) {
    if (typeof this.body[key] !== 'string') {
      this.body[key] = ''
    }
  }

  this.body = {
    task: this.body.task,
    everyRealized: this.body.everyRealized,
    todayRealized: this.body.todayRealized,
    session: this.body.session,
    pomodories: this.body.pomodories,
    isDiary: this.body.isDiary,
  }
}
Task.prototype.update = async function (id) {
  if (typeof id !== 'string') return
  this.valida()
  if (this.errors.length > 0) return
  this.task = await TaskModel.findByIdAndUpdate(id, this.body, {
    new: true,
  })
}
Task.prototype.addTodayPomodorie = async function (id) {
  if (typeof id !== 'string') return
  if (this.errors.length > 0) return
  const task = await Task.buscaPorId(id)
  const taskTodayNumber = task.todayRealized + 1
  const taskEveryNumber = task.everyRealized + 1
  const session = task.session + 1
  console.log(
    console.log('Every'),
    taskEveryNumber,
    console.log('Today'),
    taskTodayNumber,
    console.log('Session'),
    session
  )

  return (this.task = await TaskModel.findByIdAndUpdate(id, {
    $set: {
      todayRealized: taskTodayNumber,
      everyRealized: taskEveryNumber,
      session: session,
    },
  }))
}
Task.prototype.resetPomodories = async function (id) {
  if (typeof id !== 'string') return
  if (this.errors.length > 0) return
  const idTasks = id.split(' ')
  console.log(idTasks)
  for (const idTask of idTasks) {
    this.task = await TaskModel.findByIdAndUpdate(idTask, {
      $set: { todayRealized: 0, session: 0 },
    })
  }
}

Task.prototype.deletePomodories = async function (id) {
  if (typeof id !== 'string') return
  if (this.errors.length > 0) return
  const idTasks = id.split(' ')
  console.log(idTasks)
  for (const idTask of idTasks) {
    this.task = await TaskModel.findByIdAndDelete({ _id: idTask })
  }
}

Task.buscaPorId = async function (id) {
  if (typeof id !== 'string') return
  const task = await TaskModel.findById(id)
  return task
}
Task.buscaTasks = async function () {
  const tasks = await TaskModel.find().sort({ date: -1 })
  console.log(tasks)
  return tasks
}
Task.delete = async function (id) {
  if (typeof id !== 'string') return
  const task = await TaskModel.findOneAndDelete({ _id: id })
  return task
}

module.exports = Task

//Criando modelo = model

/** CRIANDO DADO */
// TaskModel.create({
//   titulo: "O dolly",
//   descricao: "O dolly é o Dolly o dolly sabe que o dolly descricao",
// })
//  Vai retornar uma promise
//   .then((dados) => console.log(dados))
//   .catch((e) => console.log(e));

/**  BUSCANDO DADOS */
//  TaskModel.find({titulo: "O dolly"})
//  Vai retornar uma promise
//   .then((dados) => console.log(dados))
//   .catch((e) => console.log(e));
