const express = require("express");
const app = express();

//         Criar   ler  atualizar apagar
// CRUD -> CREATE, READ, UPDATE, DELETE
//         POST    GET   PUT     DELETE

// http://meusite.com <- GET -> Entregue a pagina. rota /
// http://meusite.com/sobre <- GET -> Entregue a pagina. rota /sobre

/********* MIDDLEWARE *************
 * antes de entregar o conteudo final eu posso colocar
 * antes uma função qualquer coisa que no fim vai se
 * caracterizar como "Middleware" como uma cola
 * tambem posso colocar depois no final qualquer parte
 * que sempre vai passar por ele antes de chegar
 * pra criar um middleware é bem simples olha o exemplo
 */
/**
 * OBS: no middleware deve ter os mesmos argumentos
 * (requisição, resposta, next)
 * principalmente o next que vai ser usado pra avançar
 * pro proximo middleware ou final
 */
function meuMiddleware(req, res, next) {
  console.log("passei pelo middlere");
  next();
}
/******** MIDDLEWARE GLOBAL ************
 * pra usar um middleware globalmente basta
 * colocar ele assim no express ex
 * app.use(middleware)
 */
app.get(
  "/",
  meuMiddleware,
  (req, res, next) => {
    // res.send é usado pra enviar algo diretamente pra pagina
    // mas pra renderizar uma pagina com o padão configurado no express
    // seria res.render('nome do arquivo apenas') ja que a pasta ja vai
    // estar configurada no express tambem, e nem a extensão
    // OBS: consigo adicionar obj dentro do req

    res.send(`
  <form action="/" method="POST">
  Nome: <input type="text" name="nome"><br>
  Sobrenome: <input type="text" name="sobrenome"><br>
  <button>Enviar</button>
  </form>
  `);

    next();
  },
  () => console.log("sou o middleware após a resposta ao cliente")
);

/** req.params & req.query **\
 * Params exemplo
 * /testes/Brian/Cristiano
 * Query exemplo
 * /testes/?nome=Brian&sobrenome=Cristiano
 */ //OBS: ao usar "?" após o parametro se torna opcional
//OBS: query não funciona no "/"
app.get("/testes/:nome?/:sobrenome?", (req, res) => {
  console.log(req.params);
  console.log(req.query);
  res.send({ query: req.query, param: req.params });
});

app.use(express.urlencoded({ extended: true }));

app.post("/", (req, res) => {
  console.log(req.body);
  //obs: esse "nome" é o valor da tag name do input
  res.send(`enviado ${req.body.nome}`);
});

app.get("/contato", (req, res) => {
  res.send("Obrigado por entrar em contato com a gente");
});

app.listen(3000, console.log("servidor on http://localhost"));
