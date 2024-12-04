const express = require("express");
const mongoose = require("mongoose");
const seedRoutes = require("./routes/seedRoutes");
const passRoutes = require("./routes/passRoutes");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");


const app = express();
app.use(express.json());

// Rotas
app.use("/api/seed", seedRoutes);
app.use("/api/pass", passRoutes);
app.use("/api/auth", authRoutes);


// Exportar o app para testes
module.exports = app;