//****** Objetivo del archivo ********
// Este archivo configura las estrategias de autenticación para el registro y logueo de usuarios.

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { logger } = require("../../logger");
const DAOusuariosMongo = require("../daos/DAO.usuarios.mongo.js");
usuariosDao = DAOusuariosMongo.getInstance();
const transporter = require("../mailer/mailer");

//Función para validación de password encriptado
const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};

//Función para encriptado de password
const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

//Función para validación de autenticación
const checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/");
  }
};
// Implementación de estrategia de Login
passport.use(
  "login",
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      let usuario = await usuariosDao.getByUser(email);

      if (!usuario) {
        logger.error(`No existe el usuario ${email}`);
        return done(null, false, { message: "User not found" });
      }

      if (!isValidPassword(usuario, password)) {
        console.log(usuario.password);
        logger.error("Password incorrecto");
        return done(null, false, { message: "Password incorrect" });
      }
      return done(null, usuario.email);
    }
  )
);

// Implementación de estrategia de Registro
passport.use(
  "signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      let usuario = await usuariosDao.getByUser(email);
      const { name, phone, address } = req.body;

      if (usuario) {
        logger.error(`El usuario ${user} ya existe`);
        return done(null, false, { message: "User already exists" });
      }

      let newUser = {
        email,
        phone,
        password: createHash(password),
        name,
        address,
      };

      usuariosDao.save(newUser);
      const mailOptions = {
        from: "Servidor Ecommerce",
        to: process.env.MAIL_USER,
        subject: `Nuevo Usuario Registrado`,
        html: `Datos del usuario:
      <br>
      Nombre: ${newUser.name} <br>
      Email: ${newUser.email} <br>
      Dirección: ${newUser.address} <br>
      Telefono: ${newUser.phone} <br>
    `,
      };
      const info = await transporter.sendMail(mailOptions);
      return done(null, newUser);
    }
  )
);

module.exports = { passport, checkAuth, usuariosDao };
