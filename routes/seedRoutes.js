const express = require("express");
const router = express.Router();
const Seed = require("../models/seedModel"); // Certifique-se de que está importando corretamente
const { protect } = require("../middleware/authMiddleware");

// Rota para listar todos os itens (GET /api/seed)
router.get("/", protect, async (req, res) => {
  try {
    const seeds = await Seed.find(); // Busca todos os itens no banco
    res.status(200).json(seeds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para criar um novo item (POST /api/seed)
router.post("/", protect, async (req, res) => {
  try {
    const newSeed = new Seed(req.body); // O campo 'seed' será gerado automaticamente
    const savedSeed = await newSeed.save(); // Salva no banco de dados
    res.status(201).json(savedSeed);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/:id", protect, async (req, res) => {
  try {
    const seed = await Seed.findOne({ seed: req.params.id }); // Busca pelo campo seed
    if (!seed) {
      return res.status(404).json({ error: "Seed não encontrada" });
    }
    res.status(200).json(seed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para atualizar um item por ID (PUT /api/seed/:id)
router.put("/:id", protect, async (req, res) => {
  try {
    const updatedSeed = await Seed.findOneAndUpdate(
      { seed: req.params.id }, // Busca pelo campo seed
      req.body,
      { new: true, runValidators: true } // Retorna o item atualizado
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

// Deletar um item pelo campo seed (DELETE /api/seed/:id)
router.delete("/:id", protect, async (req, res) => {
  try {
    const deletedSeed = await Seed.findOneAndDelete({ seed: req.params.id }); // Busca pelo campo seed

    if (deletedSeed) {
      res.status(200).json({ message: "Item excluído com sucesso" });
    } else {
      res.status(404).json({ message: "Item não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota POST /api/seed/search para buscar seeds pelo service e account
router.post("/search", protect, async (req, res) => {
  const { service, account } = req.body;

  if (!service || !account) {
    return res.status(400).json({ error: "Os campos 'service' e 'account' são obrigatórios" });
  }

  try {
    const seeds = await Seed.find({ service, account });

    if (seeds.length === 0) {
      return res.status(404).json({ error: "Nenhuma seed encontrada para os critérios fornecidos" });
    }

    const results = seeds.map((seed) => {
      try {
        // Descriptografa o pass e inclui no resultado
        return {
          ...seed.toObject(),
          pass: seed.decryptPass(),
        };
      } catch (error) {
        console.error("Erro ao descriptografar a seed:", seed._id, error.message);
        return {
          ...seed.toObject(),
          pass: null, // Retorna nulo se houver erro
        };
      }
    });

    res.status(200).json({
      message: "Seeds encontradas com sucesso",
      seeds: results,
    });
  } catch (error) {
    console.error("Erro ao buscar seeds:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; // Exporta o roteador para ser usado no app.js