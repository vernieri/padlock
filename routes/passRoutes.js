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

module.exports = router;