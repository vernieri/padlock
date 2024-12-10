const express = require("express");
//const { register, login } = require("../controllers/authController");
const crypto = require("crypto");
const User = require("../models/userModel");
const logger = require("../utils/logger");
const bcrypt = require("bcryptjs"); // Para hash de nova senha, se necessário
//const router = express.Router();
require("dotenv").config();
//const express = require("express");
const { register, login, listUsers } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", listUsers); // Opcional: Listar todos os usuários (admin)
/*
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Gera o token e salva no banco
    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // Crie o link de redefinição
    const resetURL = `http://localhost:3000/reset-password/${resetToken}`;

    // Simule envio de e-mail (ou integre com um serviço como SendGrid)
    logger.info(`Link de redefinição de senha: ${resetURL}`);

    res.status(200).json({ message: "E-mail de recuperação enviado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Verifica o token e sua validade
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Token inválido ou expirado" });
    }

    // Atualiza a senha e remove o token
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Senha redefinida com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

*/
let currentPassword = "senhaSegura123"; // Simula a senha atual do sistema

// Rota para redefinir a senha usando o MASTER_RESET_TOKEN
router.post("/reset-password", async (req, res) => {
  const { masterToken, newPassword } = req.body;

  // Valida o token mestre
  if (masterToken !== process.env.MASTER_RESET_TOKEN) {
    return res.status(401).json({ error: "Token de redefinição inválido" });
  }

  try {
    // Atualiza a senha no sistema (simulação com hash)
    const salt = await bcrypt.genSalt(10);
    currentPassword = await bcrypt.hash(newPassword, salt);

    res.status(200).json({ message: "Senha redefinida com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Simulação de login para testar a senha atual
router.post("/login", async (req, res) => {
  const { password } = req.body;

  // Compara a senha enviada com a senha atual
  const isMatch = await bcrypt.compare(password, currentPassword);
  if (!isMatch) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

  res.status(200).json({ message: "Login bem-sucedido" });
});


module.exports = router;