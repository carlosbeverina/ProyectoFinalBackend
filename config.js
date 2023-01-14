//****** Objetivo del archivo ********
// Contiene la configuración para mongoDB

config = {
  mongoDB: {
    conn: process.env.MONGO_URL,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    },
  },
};

module.exports = config;
