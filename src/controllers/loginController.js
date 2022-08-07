const Login = require("../models/LoginModel");

exports.index = (req, res) => {
  res.render("login", {
    csrfToken: req.csrfToken(),
  });
  //res.send("login paginaaaa");

  return;
};

exports.register = async function (req, res) {
  try {
    const login = new Login(req.body);
    await login.register();
    if (login.errors.length > 0) {
      req.flash("errors", login.errors);
      req.session.save(() => {
        return res.redirect("/login");
      });
      console.log(req.session, login.errors);
      return;
    }
    req.flash("success", "Usuario criado com sucesso :D");
    req.session.save(() => {
      return res.redirect("/login");
    });
  } catch (e) {
    console.log(e);
    res.render("404");
  }
};

exports.login = async function (req, res) {
  console.log(req.body);
  try {
    const login = new Login(req.body);
    await login.logging();
    if (login.errors.length > 0) {
      req.flash("errors", login.errors);
      req.session.save(() => {
        return res.redirect("/login");
      });
      return;
    }
    req.flash("success", "Logado com sucesso");
    req.session.user = login.user;
    req.session.save(() => {
      return res.redirect("/");
    });
  } catch (e) {
    console.log(e);
    res.render("404");
  }
};

exports.logout = function logout(req, res) {
  req.session.destroy();
  res.redirect("/login");
};
