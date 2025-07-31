const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  number: String,
  location: String,
  status: { type: String, enum: ["available", "unavailable"], default: "available" }
});

module.exports = mongoose.model("Seat", seatSchema);
