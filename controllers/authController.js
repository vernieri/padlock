const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger"); // Importa o logger

// Gera o token JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
};

// Registrar novo usuário
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn(`Tentativa de registro com e-mail já existente: ${email}`);
      return res.status(400).json({ error: "E-mail já registrado" });
    }

    const user = await User.create({ username, email, password });
    const token = generateToken(user._id);

    logger.info(`Novo usuário registrado: ${username} (${email})`);
    res.status(201).json({
      message: "Usuário registrado com sucesso!",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    logger.error(`Erro ao registrar usuário (${email}): ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

// Login do usuário
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      logger.warn(`Falha de login para o e-mail: ${email}`);
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const token = generateToken(user._id);

    logger.info(`Usuário logado com sucesso: ${user.username} (${email})`);
    res.status(200).json({
      message: "Login realizado com sucesso!",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    logger.error(`Erro ao tentar logar (${email}): ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};


// Listar todos os usuários (apenas para admin, opcional)
exports.listUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

