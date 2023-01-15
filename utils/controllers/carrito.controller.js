//****** Objetivo del archivo ********
// Este archivo contiene todas las funciones utilizados en las rutas relacionadas a la gestion de carritos
// Son utilizadas en el archivo ./utils/routes/carrito.routes.js

// Importa funcionalidades del Carrito
const CarritoDaoMongoDB = require("../daos/DAO.carrito.mongo");
const carritoDao = CarritoDaoMongoDB.getInstance();

// Importa funcionalidades de la creacion de ordenes
const OrdenesDaoMongoDB = require("../daos/DAO.ordenes.mongo");
const ordenesDao = OrdenesDaoMongoDB.getInstance();

// Importa funcionalidades para la gestion de usuarios
const { usuariosDao } = require("../passport/passport.js");

// Importa funcionalidades para el envio de correos
const transporter = require("../mailer/mailer");

const fetch = require("node-fetch");
const { request, response } = require("express");
const { logger } = require("../../logger.js");

// Crea un carrito en la DB y devuelve su id
const createCart = async (req, res = response) => {
  try {
    console.log(req);
    let id = 1;
    res.send({ id });
  } catch (error) {
    logger.error("error", error);
  }
};

// Elimina el carrito de la DB
const deleteCart = async (req, res = response) => {
  const { id } = req.params;
  try {
    await carritoDao.deleteById(id);
    res.redirect("/carrito");
    res.send({ msg: `El carrito con id: ${id} fue eliminado.` });
  } catch (error) {
    logger.error("error", error);
  }
};

// Busca el carrito por el email del usuario y devuelve sus productos
const getCart = async (req, res = response) => {
  let correo = req.session.passport.user;
  try {
    let cart = await carritoDao.getCartByEmail(correo);
    res.send(cart.productos);
  } catch (error) {
    logger.error("error", error);
  }
};

// Agrega un producto al carrito
const addToCart = async (req, res = response) => {
  let correo = req.session.passport.user;
  const body = req.body;
  if (!correo) {
    res.redirect("/");
  }
  try {
    //Llama a la API de productos para conseguir los datos del producto a agregar
    let url = `https://final-beverina.onrender.com/productos/data/${body.id_prod}`;
    let item = await fetch(url);
    let newProd = await item.json();
    let carts = await carritoDao.getCartByEmail(correo);
    //Si no encuentra un carrito con el usuario crea uno nuevo
    if (!carts) {
      await carritoDao.newCart(correo);
      carts = await carritoDao.getCartByEmail(correo);
    }
    // Verifica si el producto ya se encuentra en el carrito e incrementa su cantidad si lo esta.
    let flag = 0;
    carts.productos.forEach((prod) => {
      if (prod._id == body.id_prod) {
        flag = 1;
        prod.qty += 1;
        prod.datetime = new Date();
      }
    });
    // Si no se encuentra en el carrito lo agrega
    if (flag == 0) {
      carts.productos.push({ ...newProd, qty: 1, datetime: new Date() });
    }
    let update = await carritoDao.getByEmailAndUpdate(correo, carts.productos);
    res.send({ msg: "Producto agregado." });
  } catch (error) {
    console.log("error", error);
  }
};

// Borra un producto del carrito
const deleteFromCart = async (req, res = response) => {
  const { id_prod } = req.params;
  let correo = req.session.passport.user;
  try {
    let cart = await carritoDao.getCartByEmail(correo);
    let filter = cart.productos.filter((prod) => prod._id !== id_prod);
    await carritoDao.getByEmailAndUpdate(correo, filter);
    res.send({ msg: "Producto eliminado." });
  } catch (error) {
    logger.error("error", error);
  }
};

// Busca el carrito y lo envia a la vista en ./views/carrito.ejs sino lo encuentra envia false a la misma vista
const buildCart = async (req, res = response) => {
  let correo = req.session.passport.user;
  try {
    let cart = await carritoDao.getCartByEmail(correo);
    if (correo && cart) {
      let productos = cart.productos;
      res.render("carrito", { productos });
    } else {
      let productos = false;
      res.render("carrito", { productos });
    }
  } catch (error) {
    logger.error("error", error);
  }
};

// Busca todos los elementos necesarios para armar la orden la genera en la DB y envia el correo al admin
const sendOrder = async (req = request, res = response) => {
  let correo = req.session.passport.user;
  let user = await usuariosDao.getByUser(correo);
  let cart = await carritoDao.getCartByEmail(correo);
  let order = await ordenesDao.newOrder(user, cart);
  let list = "";
  cart.productos.forEach((prod) => {
    list += `
        <tr>
        <td width="350" style="border: 1px solid black ; text-align: center">${prod.title}</td>
        <td width="350" style="border: 1px solid black ; text-align: center">${prod.qty}</td>
        </tr>
        `;
  });
  const mailOptions = {
    from: "Servidor Ecommerce",
    to: process.env.MAIL_USER,
    subject: `Nuevo pedido de ${user.name} - ${user.email}`,
    html: `Lista de productos:
        <table style="border: 1px solid black;">
        <thead>
            <th width="350" style="border: 1px solid black ;  text-align: center">Producto</th>
            <th width="350" style="border: 1px solid black ; text-align: center">Cantidad</th>
        </thead>
        <tbody>
        ${list}
        </tbody>
        </table>
        <br>
        Domicilio de entrega: ${user.address}
        <br>
        Numero de Orden: ${order.number}
        <br>
        Hora del Pedido: ${order.datetime}
        `,
  };
  const info = await transporter.sendMail(mailOptions);
  await carritoDao.deleteById(cart._id);
  res.send("Su pedido fue recibido ");
};

module.exports = {
  createCart,
  deleteCart,
  getCart,
  addToCart,
  deleteFromCart,
  buildCart,
  sendOrder,
};
