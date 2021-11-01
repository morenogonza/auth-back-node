const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();
const { dbConnection } = require("./db/config");

// crear el servidor / app express
const app = express();

// coneccion a BD
dbConnection();

// Directorio publiclo
app.use(express.static("public"));

// cors
app.use(cors());

// midleware lectura y parseo de lo que viene del body
app.use(express.json());

// Rutas
app.use("/api/auth", require("./routes/auth"));

// Manejar demas rutas
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public/index.html"));
});

app.listen(process.env.PORT, () => {
  console.log(`Servidor en puerto ${process.env.PORT}`);
});
