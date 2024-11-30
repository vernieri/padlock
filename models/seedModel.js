const mongoose = require("mongoose");

const seedSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  seed: { type: String, required: true, unique: true },
});

const Seed = mongoose.model("Seed", seedSchema);

module.exports = Seed;