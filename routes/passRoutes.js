const express = require("express");
const crypto = require("crypto"); // Biblioteca para hash
const { v4: uuidv4 } = require("uuid"); // Para gerar o salt aleatório
const router = express.Router();
const Seed = require("../models/seedModel"); // Modelo do MongoDB
//const { Seed, decryptPass } = require("../models/seedModel");


// Rota POST para criar um pass criptografado
router.post("/", async (req, res) => {
  const { seed } = req.body;

  if (!seed) {
    return res.status(400).json({ error: "O campo 'seed' é obrigatório" });
  }

  try {
    const data = await Seed.findOne({ seed });

    if (!data) {
      return res.status(404).json({ error: "Seed não encontrada" });
    }

    // Gerar SHA256 do seed
    const sha256Hash = crypto.createHash("sha256").update(seed).digest("hex");

    // Gerar um salt aleatório
    const salt = crypto.randomBytes(16).toString("hex");

    // Concatenar SHA256 + salt e gerar SHA1
    const combined = sha256Hash + salt;
    const sha1Hash = crypto.createHash("sha1").update(combined).digest("hex");

    // Atualizar o pass criptografado no MongoDB
    data.pass = sha1Hash; // O pre-save do modelo cuidará da criptografia
    await data.save();

    res.status(200).json({
      message: "Pass gerado e criptografado com sucesso!",
      pass: sha1Hash, // O pass antes da criptografia
      salt: salt,
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

// Rota GET para descriptografar um pass
router.get("/:seed/decrypt", async (req, res) => {
  const { seed } = req.params;

  try {
    const data = await Seed.findOne({ seed });

    if (!data) {
      return res.status(404).json({ error: "Seed não encontrada" });
    }

    const decryptedPass = decryptPass(data.pass);
    res.status(200).json({
      message: "Pass descriptografado com sucesso!",
      pass: decryptedPass,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;