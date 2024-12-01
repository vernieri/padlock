const express = require("express");
const crypto = require("crypto"); // Biblioteca para hash
const { v4: uuidv4 } = require("uuid"); // Para gerar o salt aleatório
const router = express.Router();
const Seed = require("../models/seedModel"); // Modelo do MongoDB

// Rota POST /api/pass
router.post("/", async (req, res) => {
  const { seed } = req.body;

  // Validação: seed é obrigatório
  if (!seed) {
    return res.status(400).json({ error: "O campo 'seed' é obrigatório" });
  }

  try {
    // Busca no banco de dados pelo seed
    const data = await Seed.findOne({ seed });

    if (!data) {
      return res.status(404).json({ error: "Seed não encontrado" });
    }

    // Gerar SHA256 do seed
    const sha256Hash = crypto.createHash("sha256").update(seed).digest("hex");

    // Gerar um salt aleatório
    const salt = uuidv4();

    // Concatenar SHA256 + salt e gerar SHA1
    const combined = sha256Hash + salt;
    const sha1Hash = crypto.createHash("sha1").update(combined).digest();

    // Encodar o SHA1 em Base64
    const passBase64 = sha1Hash.toString("base64");

    // Retornar o resultado
    res.status(200).json({
      message: "Pass gerado com sucesso!",
      service: data.service,
      account: data.account,
      pass: passBase64, // SHA1 em Base64
      salt: salt,       // O salt usado
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota PUT /api/pass/:seed
router.put("/:seed", async (req, res) => {
  const { seed } = req.params;
  const { service, account } = req.body;

  // Validação: Campos obrigatórios
  if (!service || !account) {
    return res.status(400).json({ error: "Os campos 'service' e 'account' são obrigatórios" });
  }

  try {
    // Atualizar o registro com base no seed
    const updatedSeed = await Seed.findOneAndUpdate(
      { seed },
      { service, account },
      { new: true, runValidators: true }
    );

    if (!updatedSeed) {
      return res.status(404).json({ error: "Seed não encontrado" });
    }

    res.status(200).json({
      message: "Seed atualizada com sucesso!",
      data: updatedSeed,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota DELETE /api/pass/:seed
router.delete("/:seed", async (req, res) => {
  const { seed } = req.params;

  try {
    // Deletar o registro com base no seed
    const deletedSeed = await Seed.findOneAndDelete({ seed });

    if (!deletedSeed) {
      return res.status(404).json({ error: "Seed não encontrado" });
    }

    res.status(200).json({ message: "Seed excluída com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;