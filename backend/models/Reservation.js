const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  intern: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  seat: { type: mongoose.Schema.Types.ObjectId, ref: "Seat" },
  date: Date,
  timeSlot: String,
  status: { type: String, enum: ["active", "cancelled","assigned"], default: "active" }
});

module.exports = mongoose.model("Reservation", reservationSchema);
