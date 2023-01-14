//****** Objetivo del archivo ********
// Este archivo contiene todas las funciones utilizados en las rutas relacionadas a la gestión de productos
// Son utilizadas en el archivo ./utils/routes/productos.routes.js

const { logger } = require("../../logger.js");

//Importa las funcionalidades para la gestión de productos
const DAOproductosMongo = require('../daos/DAO.productos.mongo.js');
productosDao = DAOproductosMongo.getInstance()

// Establece el rol de administrador como true hardcodeado
const administrador = true;

// Busca todos los productos de la DB y los envia a la vista ./views/productos.ejs
const getProducts = async (req, res) => {
  try {
    const productos = await productosDao.getAll();
    let user = req.session.passport.user;
    res.render("productos", { productos, administrador, user });
  } catch (error) {
    logger.error("error", error);
  }
};

//Busca los productos listados bajo una categoria
const getByCat = async (req, res) => {
  const { cat } = req.params;
  const productos = await productosDao.getByCategory(cat);
  res.render("productos", { productos, administrador });
};

// Elimina un producto de la DB
const removeProduct = async (req, res) => {
  logger.info("/productos-test GET");
  const { id } = req.params;
  await productosDao.deleteById(id);
  res.send({ msg: "Producto eliminado" });
};

//Busca un producto por su Id de la DB
const getProduct = async (req, res) => {
  try {
    logger.info("/productos-test GET");
    const { id } = req.params;
    let producto = await productosDao.getById(id);
    res.send({ ...producto._doc });
  } catch (error) {
    res.send({ msg: "Producto no Encontrado" });
  }
};

// Agrega un producto a la DB y devuelve los datos cargados
const addProduct = async (req, res) => {
  logger.info("/productos-test/add POST");
  let save = await productosDao.save(req.body);
  res.send({ ...save[0] });
};

// Modifica los elementos de un producto
const modProduct = async (req, res) => {
  const { id } = req.params;
  logger.info("/productos-test/add PUT");
  await productosDao.getByIdAndUpdate(id, req.body);
  res.send({ msg: "Producto Modificado" });
};

// Devuelve todos los Id de los productos en la DB
const getIDs = async (req, res) => {
  let prods = await productosDao.getAll();
  res.send(prods[0]._id);
};

// Devuelve los datos de un producto en particular
const getData = async (req, res) => {
  const { id } = req.params;
  try {
    const productos = await productosDao.getById(id);
    res.send(productos);
  } catch (error) {
    res.json({ error: "producto no encontrado" });
    logger.error({ error: "producto no encontrado" });
  }
};

module.exports = {
  getProducts,
  getProduct,
  addProduct,
  getIDs,
  modProduct,
  removeProduct,
  getData,
  getByCat,
};
