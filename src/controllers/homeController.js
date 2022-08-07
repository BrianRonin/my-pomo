const Task = require('../models/TaskModel')

exports.index = async function (req, res) {
  const tasks = await Task.buscaTasks()
  // console.log(contatos);
  console.log(req.header)
  res.render('index', {
    csrfToken: req.csrfToken(),
    tasks: tasks,
    js: '<script src="/assets/js/home.js"></script>',
    css: '<link rel="stylesheet" href="/assets/css/home.css">',
  })
  //res.send("<h1>ola</h1>");
}

exports.addTodayPomodorie = async function (req, res) {
  try {
    if (!req.params.id) return res.render('404')
    const task = new Task(req.body)
    await task.update(req.params.id)
    if (task.errors.length > 0) {
      req.flash('errors', task.errors)
      //return res.redirect("/task");
    }
    req.flash('success', 'atualizado com sucesso')
    req.session.save(() => {
      return res.redirect('/')
    })
  } catch (e) {
    console.log(e)
    return res.render('404')
  }
}
