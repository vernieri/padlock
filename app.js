const express = require("express");
const mongoose = require("mongoose");
const seedRoutes = require("./routes/seedRoutes");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/api/seed", seedRoutes);

mongoose.connect("mongodb://127.0.0.1:27017/seedDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});