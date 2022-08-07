;('use strict')
const path = require('path') // path pra resolver caminhos
const express = require('express') //express
const app = express()
app.use(express.urlencoded({ extended: true })) // ????
app.use(express.json())

/***** CONEXAO A BASE DE DADOS MOONGO DB UTILIZANDO MONGOOSE  **********\
 */ //mongoose é usado pra manipular o BD
const mongoose = require('mongoose')
//usando dotenv pra proteger minha string de login com o banco de dados
require('dotenv').config()
//fazendo a conexão com moongose
mongoose //utilizando chave no .env do dotenv
  .connect(process.env.connectionString)
  .then(() => {
    console.log(
      'conexão mongoDB realizada com sucesso'
    )
    /**
     * Com isso após a promise que retorna do moongose.connect
     * consigo emitir um sinal pro app assim app.emit('sinal')
     * ele funciona normalmente fora de um obj ainda não
     * compreendo porque na aula ele foi posto em um obj
     */
    app.emit('mongoON')
  })
  .catch((e) => console.log(e))

/******* SALVANDO SESSÃO DO USUARIO *******\
 * utilizados
 * https://www.npmjs.com/package/connect-mongo
 * https://www.npmjs.com/package/express-session
 * https://www.npmjs.com/package/connect-flash !!(9 anos atras)
 *
 * session vai colocar na req uma propriedade chamada session
 * que vai salvar a seção do usuario, e vai usar mongoStorage
 * outra aplicação feita especialmente pra criar e salvar a sessão
 * no mongoDB inves de no cliente, flash() é antigo do express 3x
 * que vai criar mensagens e se auto destruir após serem vizualizadas
 *
 * OBS: resto da configuração no HomeController
 */
const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')

app.use(
  session({
    secret: 'Keydawdwa()',
    store: MongoStore.create({
      mongoUrl: process.env.connectionString,
    }),
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
    httpOnly: true,
  })
)

app.use(flash())

/** usando middlewareGlobalmente **\
 * OBS: eu posso escolher uma rota especifica pra usar o middleware assim:
 * app.use('/ROTA',middlewareGlobal);
 */
const {
  middlewareGlobal,
  checkCsfr,
} = require('./src/middlewares/middleware')
app.use(middlewareGlobal)

/** usando static **\
 * configurar a pasta public que vai conter os
 * conteudos estaticos do projeto como imagens logos css
 */
app.use(express.static(__dirname + '/public'))
//app.use(express.static("./public"));

/*** views engine ***\
 * app.set = configuração do express
 */
//viwes, "pasta das views"
app.set(
  'views',
  path.resolve(__dirname, 'src', 'views')
)

//view engine, "engine usada pra renderizar a view"
app.set('view engine', 'ejs')

/*** Usando Helment pra aumentar a segurança ***\
 */
const helmet = require('helmet')
// app.use(helmet())
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//       scriptSrc: [
//         '"self"',
//         'https://cdnjs.cloudflare.com',
//         'code.jquery.com',
//         'cdnjs.cloudflare.com',
//         'stackpath.bootstrapcdn.com',
//       ],
//     },
//   })
// )

/*** Usando Csurf pra segurança dos formularios ***\
 * Csurf usa um token de segurança em todos
 * formularios agora, ele guarda esse token no session
 */
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const csrf = require('csurf')

app.use(
  bodyParser.urlencoded({ extended: false })
)
app.use(cookieParser())
app.use(csrf({ cookie: true }))
app.use(checkCsfr)

/*** USANDO ROTAS ***\
 */
const routes = require('./routes')
app.use(routes)

/** ESCUTANDO O SERVIDOR ****\
 * agora consigo pegar esse sinal apos conectar ao BD com app.on
 * e colocar uma função no segundo argumento
 */
app.on('mongoON', () => {
  // servidor escuta agora apenas após a conexão com a DB
  app.listen(3000, console.info('servidor on 1'))
})

module.exports = app
