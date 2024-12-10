const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  level: { type: String, required: true }, // error, warn, info
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Log = mongoose.model("Log", logSchema);
module.exports = Log;