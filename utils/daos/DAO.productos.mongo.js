//****** Objetivo del archivo ********
// Este archivo crea la clase para la gestion de productos como extension de ContenedorMongoDB
// Son utilizadas en el archivo ./utils/controllers/produtos.controller.js

const ContenedorMongoDB = require('../repositorios/ContenedorMongoDB.js');
let instance = null

const schema = {
    title:{ type: String, required: true },
    price: { type: Number, required: true },
    category:{ type: String, required: true },
    thumbnail: { type: String },
    desc:{ type: String }
  }
  

class DAOproductosMongo extends ContenedorMongoDB{
    constructor(){
        super('productos',schema)
    }
    
    static getInstance(){
        if(!instance){
            instance = new DAOproductosMongo;
        }
        return instance;
    }
    // Funcion especifica para obtener productos de una categoria
    async getByCategory(cat){
        try {
            let productos = this.collection.find({category: cat})
            return productos
        } catch (error) {
            console.log(error)
        }
    }

}

module.exports = DAOproductosMongo;