const express = require('express')
const route = express.Router()
//middleware
const {
  loginRequired,
  existRequired,
  ajax,
} = require('./src/middlewares/middleware')
//home
const homeController = require('./src/controllers/homeController')
route.get('/', homeController.index)
//login
const loginController = require('./src/controllers/loginController')
route.get('/login', existRequired, loginController.index)
route.post('/login/register', existRequired, loginController.register)
route.post('/login/login', existRequired, loginController.login)
route.get('/login/logout', loginController.logout)
//tasks
const taskController = require('./src/controllers/taskController')
route.get('/task', loginRequired, taskController.index)
route.post('/task/register', taskController.register)
route.get('/task/:id', loginRequired, taskController.id)
route.post('/task/update', taskController.update)
route.post('/task/addTodayPomodorie', taskController.addTodayPomodorie)
route.post('/task/resetPomodories', taskController.resetPomodories)
route.post('/task/deletePomodories', taskController.deletePomodories)
route.get('/task/delete/:id', loginRequired, taskController.delete)

module.exports = route
