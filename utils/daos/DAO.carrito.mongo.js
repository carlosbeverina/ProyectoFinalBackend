//****** Objetivo del archivo ********
// Este archivo crea la clase para la gestion del carrito como extension de ContenedorMongoDB
// Son utilizadas en el archivo ./utils/controllers/carrito.controller.js

const ContenedorMongoDB = require("../repositorios/ContenedorMongoDB.js");
let instance = null

class CarritoDaoMongoDB extends ContenedorMongoDB {
  constructor() {
    super("carritos", {
      user: { type: String, require: true },
      productos: { type: Array, required: false },
    });
  }

  // Función especifica para la creación de Carrito
  async newCart(user) {
    try {
      let toSave = { user, productos: [] };
      let response = await this.collection.insertMany(toSave);
      return user;
    } catch (error) {
      console.log("error", error);
    }
  }
  // Función especifica para buscar por email en lugar de por Id
  async getCartByEmail(correo) {
    try {
      let cart = await this.collection.findOne({ email: correo });
      return cart;
    } catch (error) {
      console.log("error", error);
    }
  }
  // Función especifica para buscar por email en lugar de por Id y actualizar
  async getByEmailAndUpdate(correo, obj) {
    try {
      let val = this.collection.findOneAndUpdate(
        { email: correo },
        { productos: obj },
        function (err, docs) {
          if (err) {
            console.log(err);
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  static getInstance() {
    if (!instance) {
      instance = new CarritoDaoMongoDB();
    }
    return instance;
  }
}

module.exports = CarritoDaoMongoDB;
