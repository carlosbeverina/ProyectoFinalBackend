//****** Objetivo del archivo ********
// Este archivo configura las rutas del router de las funciones de logeo, registro, información y chat.

const { Router } = require("express");
const RouterApi = Router();
const { checkAuth } = require("../passport/passport.js");
const {
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
} = require("../controllers/api.controller.js");

RouterApi.get("/info", getInfo);

RouterApi.get("/", getLogin);

RouterApi.get("/logout", logout);

RouterApi.get("/signup", getSignup);

RouterApi.get("/errorSignUp", errorSignup);

RouterApi.get("/errorLogin", errorLogin);

RouterApi.post("/login", login);

RouterApi.post("/signup", signup);

RouterApi.get("/chat", checkAuth, chat);

RouterApi.get("/chat/:user", checkAuth, chatUser);

module.exports = RouterApi;
