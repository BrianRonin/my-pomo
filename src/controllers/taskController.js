const Task = require('../models/TaskModel')

exports.index = (req, res) => {
  res.render('task', {
    csrfToken: req.csrfToken(),
  })
}
exports.register = async function (req, res) {
  try {
    const task = new Task(req.body)
    await task.register()
    if (task.errors.length > 0) {
      // req.flash('errors', task.errors)
      return res.redirect('/task')
    }
    // req.flash('success', 'registrado')
    req.session.save(() => {
      return res.redirect(`/task/${task.task._id}`)
    })
  } catch (e) {
    console.log(e)
    return res.render('404')
  }
}

exports.id = async function (req, res) {
  const task = await Task.buscaPorId(req.params.id)
  if (!req.params.id) return res.render('404')
  if (!task) return res.render('404')
  res.render('task', { task: task, csrfToken: req.csrfToken() })
}

exports.update = async function (req, res) {
  try {
    if (!req.params.id) return res.render('404')
    const task = new Task(req.body)
    await task.update(req.params.id)
    if (task.errors.length > 0) {
      // req.flash('errors', task.errors)
      //return res.redirect("/task");
    }
    // req.flash('success', 'atualizado com sucesso')
    req.session.save(() => {
      return res.redirect('/')
    })
  } catch (e) {
    console.log(e)
    return res.render('404')
  }
}

exports.addTodayPomodorie = async function (req, res) {
  try {
    const task = new Task(req.body)
    await task.addTodayPomodorie(req.body.id)
    if (task.errors.length > 0) {
      // req.flash('errors', task.errors)
    }
    res.status(200)
  } catch (e) {
    console.log(e)
    return res.render('404')
  }
}

exports.resetPomodories = async function (req, res) {
  try {
    const task = new Task(req.body)
    console.log(req.body)
    await task.resetPomodories(req.body.id)
    if (task.errors.length > 0) {
      // req.flash('errors', task.errors)
    }
    res.status(200)
  } catch (e) {
    console.log(e)
    return res.render('404')
  }
}
exports.deletePomodories = async function (req, res) {
  try {
    const task = new Task(req.body)
    console.log(req.body)
    await task.deletePomodories(req.body.id)
    if (task.errors.length > 0) {
      // req.flash('errors', task.errors)
    }
    res.status(200)
  } catch (e) {
    console.log(e)
    return res.render('404')
  }
}

exports.delete = async function (req, res) {
  if (!req.params.id) return res.render('404')
  const task = await Task.delete(req.params.id)
  if (!task) return res.render('404')
  res.redirect('/')
}
