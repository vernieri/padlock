const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const seedSchema = new mongoose.Schema({
  service: { type: String, required: true },
  account: { type: String, required: true },
  seed: {
    type: String,
    required: true,
    unique: true,
    default: uuidv4, // Gera um UUID automaticamente
  },
});

const Seed = mongoose.model("Seed", seedSchema);

module.exports = Seed;