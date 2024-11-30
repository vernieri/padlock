const express = require("express");
const router = express.Router();
const Seed = require("../models/seedModel"); // Importando o modelo atualizado

// Rota para listar todos os itens (GET /api/seed)
router.get("/", async (req, res) => {
  try {
    const seeds = await Seed.find(); // Busca todos os itens no banco
    res.status(200).json(seeds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para criar um novo item (POST /api/seed)
router.post("/", async (req, res) => {
  try {
    const newSeed = new Seed(req.body); // Cria o item com base no body recebido
    const savedSeed = await newSeed.save(); // Salva no banco de dados
    res.status(201).json(savedSeed);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Rota para buscar um item por ID (GET /api/seed/:id)
router.get("/:id", async (req, res) => {
  try {
    const seed = await Seed.findById(req.params.id); // Busca pelo ID
    if (seed) {
      res.status(200).json(seed);
    } else {
      res.status(404).json({ message: "Item não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para atualizar um item por ID (PUT /api/seed/:id)
router.put("/:id", async (req, res) => {
  try {
    const updatedSeed = await Seed.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedSeed) {
      res.status(200).json(updatedSeed);
    } else {
      res.status(404).json({ message: "Item não encontrado" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Rota para deletar um item por ID (DELETE /api/seed/:id)
router.delete("/:id", async (req, res) => {
  try {
    const deletedSeed = await Seed.findByIdAndDelete(req.params.id);
    if (deletedSeed) {
      res.status(200).json({ message: "Item excluído com sucesso" });
    } else {
      res.status(404).json({ message: "Item não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; // Exporta o roteador para ser usado no app.js