const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("DB conectada");
  } catch (error) {
    console.log(error);
    throw new Error("Error al conectar con BD");
  }
};

module.exports = { dbConnection };
