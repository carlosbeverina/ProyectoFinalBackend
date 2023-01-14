//****** Objetivo del archivo ********
// Este archivo define las funciones de interacción con la DB

const mongoose = require("mongoose");
const config = require("../../config.js");
const { logger } = require("../../logger");

mongoose
  .connect(config.mongoDB.conn, config.mongoDB.options)
  .then(console.log("Conectado a Mongo"));

class ContenedorMongoDB {
  constructor(coleccion, schema) {
    this.collection = mongoose.model(coleccion, schema);
  }

  //Función para guardar un objeto en la colección de la DB
  async save(obj) {
    try {
      let response = await this.collection.insertMany(obj);
      return response;
    } catch (error) {
      logger.error(error);
    }
  }

  //Función buscar todos los elementos en la coleccion de la DB
  async getAll() {
    try {
      let data = await this.collection.find({});
      return data;
    } catch (error) {
      logger.error(error);
    }
  }

  //Función para buscar un objeto por el correo en la colección de la DB
  async getByUser(email) {
    try {
      let usuario = await this.collection.findOne({ email: email });
      if (usuario) {
        return usuario;
      } else {
        return null;
      }
    } catch (error) {
      logger.error(error);
    }
  }
 //Función para buscar un objeto por el Id en la colección de la DB
  async getById(id) {
    try {
      let producto = await this.collection.findById(id);
      if (producto) {
        return producto;
      } else {
        return null;
      }
    } catch (error) {
      logger.error(error);
    }
  }
 //Función para buscar un objeto por el Id y actualizarlo en la colección de la DB
  async getByIdAndUpdate(id, obj) {
    try {
      let producto = await this.collection.findById(id);
      producto.title = obj.title;
      producto.price = obj.price;
      producto.thumbnail = obj.thumbnail;
      producto.category = obj.category;
      producto.desc = obj.desc;

      producto.save();
    } catch (error) {
      logger.error(error);
    }
  }

   //Función para borrar un objeto por el Id en la colección de la DB
  async deleteById(id) {
    try {
      let data = await this.collection.findByIdAndDelete(id);
      if (data) {
        console.log("Eliminado");
      } else {
        console.log("El producto no existe");
      }
    } catch (error) {
      logger.error(error);
    }
  }

  //Función para borrar todos los objetos en la colección de la DB
  async deleteAll() {
    try {
      await this.collection.deleteMany({});
    } catch (error) {
      logger.error(error);
    }
  }

//Función para obtener la cantidad de objetos en la colección de la DB
  async getLength() {
    try {
      let out = this.collection.estimatedDocumentCount();
      if (out) {
        return out;
      } else {
        return null;
      }
    } catch (error) {
      logger.error(error);
    }
  }
}

module.exports = ContenedorMongoDB;
