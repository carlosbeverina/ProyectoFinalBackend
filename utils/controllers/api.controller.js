//****** Objetivo del archivo ********
// Este archivo contiene todas las funciones utilizados en las rutas relacionadas a autenticacion, logeo, información y chat
// Son utilizadas en el archivo ./utils/routes/api.routes.js

const { logger } = require("../../logger.js");
// Se importa para realizar la validación de el logueo y Sign up
const { passport } = require("../passport/passport.js");

// Devuelve la vista de información de ./views/info.ejs
const getInfo = (req, res) => {
  logger.info("/info GET");
  res.render("info");
};

// Si el usuario se encuentra autenticado redirije a la vista de productos, sino devuelve la vista de ./views/login.ejs
const getLogin = async (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/productos");
  } else {
    logger.info("/productos-test/login GET");
    res.render("login", { root: __dirname });
  }
};

// Realiza el deslogueo y devuelve el mensaje de despedida del usuario en la vista ./views/logout.ejs
const logout = (req, res) => {
  logger.info("/productos-test/logout GET");
  let user = req.session.user;
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.render("logout", { user });
  });
};

// Devuelve la vista de información de ./views/signup.ejs
const getSignup = (req, res) => {
  logger.info("/productos-test/signup GET");
  res.render("signup");
};

// Devuelve la vista de información de ./views/signup.ejs
const errorSignup = (req, res) => {
  logger.info("/productos-test/errorSignUp GET");
  res.render("errorSignUp");
};

// Devuelve la vista de información de ./views/errorlogin.ejs
const errorLogin = (req, res) => {
  logger.info("/productos-test/errorLogin GET");
  res.render("errorlogin");
};

// Implementa la estrategia de autenticacion para el logeo definida en ./utils/controllers/passport/passport.js
const login = passport.authenticate("login", {
  successRedirect: "/productos",
  failureRedirect: "/errorlogin",
});

// Implementa la estrategia de autenticacion para el registro definida en ./utils/controllers/passport/passport.js
const signup = passport.authenticate("signup", {
  successRedirect: "/",
  failureRedirect: "/errorSignUp",
});

// Devuelve la vista de información de ./views/chat.ejs
const chat = (req, res) => {
  logger.info("/productos-test/chat GET");
  res.render("chat");
};

// Devuelve la vista de información de ./views/chatUser.ejs
const chatUser = (req, res) => {
  const { user } = req.params;
  logger.info("/productos-test/chat GET");
  res.render("chatUser", { user });
};

module.exports = {
  getInfo,
  getLogin,
  logout,
  getSignup,
  errorSignup,
  login,
  signup,
  errorLogin,
  chat,
  chatUser,
};
