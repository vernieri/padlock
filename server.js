const mongoose = require("mongoose");
const logger = require("./utils/logger"); // Importa o logger
const app = require("./app"); // Importa o app configurado

// Conectando ao banco de dados
mongoose
  .connect("mongodb://127.0.0.1:27017/padlockDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => logger.info("Conectado ao MongoDB com sucesso"))
  .catch((error) => logger.error(`Erro ao conectar ao MongoDB: ${error.message}`));

// Iniciando o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT}`);
});

// Captura de erros não tratados
process.on("uncaughtException", (error) => {
  logger.error(`Erro não tratado: ${error.message}`);
  process.exit(1); // Finaliza o processo
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error(`Rejeição não tratada: ${reason}`);
  process.exit(1); // Finaliza o processo
});