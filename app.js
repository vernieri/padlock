const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require('uuid'); // Instale com `npm install uuid`


// Configurações do servidor
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Conexão com MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/padlockDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Erro na conexão com o MongoDB:"));
db.once("open", () => {
  console.log("Conectado ao MongoDB!");
});

// Definição do esquema e modelo
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  service: String,
  account: String,
  seed: { type: String, required: true, unique: true },
  description: String,
});

const Item = mongoose.model("Item", itemSchema);

// Rotas CRUD
// Criar (Create)

app.post("/items", async (req, res) => {
  try {
    const seed = uuidv4(); // Gera um identificador único
    const newItem = new Item({ ...req.body, seed }); // Inclui o seed
    const savedItem = await newItem.save();

    res.status(201).json({
      message: "Item criado com sucesso",
      savedItem,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Listar todos (Read)
app.get("/items", async (req, res) => {
  try {
    const items = await Item.find(); // Busca todos os documentos na coleção "items"
    
    // Personalizar a resposta para incluir um exemplo de body
    res.status(200).json({
      message: "Itens recuperados com sucesso",
      requestBodyExample: {
        name: "Example Name",
        service: "Examplo",
        account:"Conta",
        seed:"Semente",
        description: "Example Description"
      },
      items, // Inclui a lista de itens no banco de dados
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Buscar por ID (Read)
app.get("/items/:id", async (req, res) => {
  try {
    const item = await Item.findOne({ seed: req.params.id }); // Busca pelo seed

    if (item) {
      res.status(200).json({
        message: "Item encontrado",
        item,
      });
    } else {
      res.status(404).json({ message: "Item não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Atualizar (Update)
app.put("/items/:id", async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedItem) {
      res.status(200).json(updatedItem);
    } else {
      res.status(404).json({ message: "Item não encontrado" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Excluir (Delete)
app.delete("/items/:id", async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (deletedItem) {
      res.status(200).json({ message: "Item excluído com sucesso" });
    } else {
      res.status(404).json({ message: "Item não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});