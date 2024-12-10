const { createLogger, format, transports } = require("winston");
const Log = require("../models/logModel");


const logger = createLogger({
  level: "info", // Níveis: error, warn, info, http, verbose, debug, silly
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new transports.Console(), // Exibe logs no console
    new transports.File({ filename: "logs/app.log" }) // Salva logs em arquivo
  ],
});



const saveLogToDB = (level, message) => {
  const log = new Log({ level, message });
  log.save().catch((error) => console.error("Erro ao salvar log no MongoDB:", error));
};

logger.on("data", (log) => saveLogToDB(log.level, log.message));


module.exports = logger;
