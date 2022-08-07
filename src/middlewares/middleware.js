exports.middlewareGlobal = (req, res, next) => {
  res.locals.errors = req.flash('errors')
  res.locals.success = req.flash('success')
  res.locals.user = req.session.user
  res.locals.task = ''

  // console.log(req.session.user)
  next()
}

exports.checkCsfr = function (err, req, res, next) {
  if (err) {
    res.status(403)
    res.render('../views/404.ejs')
  }
  next()
}

exports.loginRequired = (req, res, next) => {
  if (!req.session.user) {
    req.flash('errors', 'Você precisa estar logado u_u')
    req.session.save(() => res.redirect('/login'))
    return
  }

  next()
}
exports.existRequired = (req, res, next) => {
  if (req.session.user) {
    req.flash('errors', 'Você precisa sair da sua conta para isso')
    req.session.save(() => res.redirect('/'))
    return
  }

  next()
}

exports.ajax = function (req, res, next) {
  res.setHeader(
    'Content-Security-Policy',
    "script-src 'self' https://cdnjs.cloudflare.com"
  )
  next()
}
