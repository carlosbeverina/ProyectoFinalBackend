//****** Objetivo del archivo ********
// Este archivo configura las rutas del router de las funciones de gestión de carrito.

const express = require("express");
const { Router } = express;
const routerCarrito = Router();
const { checkAuth } = require("../passport/passport.js");
const {
  createCart,
  deleteCart,
  getCart,
  addToCart,
  deleteFromCart,
  buildCart,
  sendOrder,
} = require("../controllers/carrito.controller.js");

routerCarrito.post("/", checkAuth, createCart);

routerCarrito.delete("/", checkAuth, deleteCart);

routerCarrito.get("/:id/productos", checkAuth, getCart);

routerCarrito.post("/productos", addToCart);

routerCarrito.delete("/:id_prod", checkAuth, deleteFromCart);

routerCarrito.get("/", checkAuth, buildCart);

routerCarrito.get("/order/", checkAuth, sendOrder);

module.exports = routerCarrito;
