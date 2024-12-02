const mongoose = require("mongoose");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const AES_SECRET_KEY = process.env.AES_SECRET_KEY || "default_secret_key_32bytes!";
const AES_IV = process.env.AES_IV || "default_iv_16bytes!";

// Definição do Schema
const seedSchema = new mongoose.Schema({
  service: { type: String, required: true },
  account: { type: String, required: true },
  seed: { type: String, required: true, unique: true, default: uuidv4 },
  pass: { type: String },
});

// Middleware para criptografar o pass antes de salvar
seedSchema.pre("save", function (next) {
  if (this.isModified("pass")) {
    const cipher = crypto.createCipheriv("aes-256-cbc", AES_SECRET_KEY, AES_IV);
    let encrypted = cipher.update(this.pass, "utf8", "hex");
    encrypted += cipher.final("hex");
    this.pass = encrypted;
  }
  next();
});

seedSchema.methods.decryptPass = function () {
  if (!this.pass) return null;
  const decipher = crypto.createDecipheriv("aes-256-cbc", AES_SECRET_KEY, AES_IV);
  let decrypted = decipher.update(this.pass, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

const Seed = mongoose.model("Seed", seedSchema);

module.exports = Seed;