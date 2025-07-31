const express = require("express");
const Reservation = require("../models/Reservation");
const Seat = require("../models/Seat");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/my", auth, async (req, res) => {
  const reservations = await Reservation.find({ intern: req.user.id }).populate("seat");
  res.json(reservations);
});
router.post("/book", auth, async (req, res) => {
  const { seatId, date, timeSlot } = req.body;

  // Check for duplicate booking by same intern
  const existing = await Reservation.findOne({ intern: req.user.id, date, timeSlot });
  if (existing) {
    return res.status(400).send("You already have a reservation at this date and time");
  }

  // Check if seat is already reserved
  const seatReserved = await Reservation.findOne({ seat: seatId, date, timeSlot });
  if (seatReserved) {
    return res.status(400).send("Seat already reserved for this date and time");
  }

  // Parse reservation datetime
  const reservationTime = new Date(`${date}T${timeSlot.padStart(2, "0")}:00:00`);
  const now = new Date();

  // Ensure reservation is at least 1 hour in advance
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
  if (reservationTime <= oneHourLater) {
    return res.status(400).send("Seats must be reserved at least 1 hour in advance");
  }

  // Save reservation
  const reservation = new Reservation({
    intern: req.user.id,
    seat: seatId,
    date,
    timeSlot,
  });
  await reservation.save();

  res.json({ msg: "Seat reserved" });
});


// Admin manually assigns a seat to an intern
router.post("/assign", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).send("Forbidden");

  const { internId, seatId, date, timeSlot } = req.body;

  // Check if seat is already taken
  const seatReserved = await Reservation.findOne({ seat: seatId, date, timeSlot });
  if (seatReserved) return res.status(400).send("Seat already reserved");

  // Optional: Check if the intern already has a reservation that day
  const existing = await Reservation.findOne({ intern: internId, date });
  if (existing) return res.status(400).send("Intern already has a reservation for this day");

  const now = new Date();
  if (new Date(date) < now || (new Date(date).toDateString() === now.toDateString() && parseInt(timeSlot) <= now.getHours())) {
    return res.status(400).send("Invalid reservation time");
  }

  const reservation = new Reservation({
    intern: internId,
    seat: seatId,
    date,
    timeSlot,
    status: "assigned"
  });

  await reservation.save();
  res.status(201).json({ msg: "Seat manually assigned" });
});


router.delete("/:id", auth, async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);

  if (!reservation) return res.status(404).send("Reservation not found");

  // Only intern who owns the reservation can cancel
  if (req.user.role !== "intern" || reservation.intern.toString() !== req.user.id) {
    return res.status(403).send("Forbidden: Only the owning intern can cancel");
  }

  // Only allow cancelling future reservations
  const now = new Date();
  const reservationDateTime = new Date(reservation.date);
  const reservationHour = parseInt(reservation.timeSlot);

  // Combine date + timeSlot to create a full datetime for comparison
  reservationDateTime.setHours(reservationHour, 0, 0, 0);

  if (reservationDateTime <= now) {
    return res.status(400).send("Cannot cancel past or ongoing reservations");
  }

  reservation.status = "cancelled";
  await reservation.save();

  res.json({ msg: "Reservation cancelled" });
});


// GET /api/reservations/all - Admin only
router.get("/all", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).send("Forbidden");

  const reservations = await Reservation.find()
    .populate("intern seat")
    .sort({ date: -1, timeSlot: 1 }); // optional sorting
  res.json(reservations);
});

router.put("/:id", auth, async (req, res) => {
  const { date, timeSlot, seatId } = req.body;
  const reservation = await Reservation.findById(req.params.id);

  if (!reservation) return res.status(404).send("Reservation not found");
  if (reservation.intern.toString() !== req.user.id) return res.status(403).send("Forbidden");

  const now = new Date();
  if (new Date(date) < now || (new Date(date).toDateString() === now.toDateString() && parseInt(timeSlot) <= now.getHours())) {
    return res.status(400).send("Invalid time");
  }

  const seatTaken = await Reservation.findOne({ seat: seatId, date, timeSlot });
  if (seatTaken && seatTaken._id.toString() !== reservation._id.toString()) {
    return res.status(400).send("Seat already reserved");
  }

  reservation.date = date;
  reservation.timeSlot = timeSlot;
  reservation.seat = seatId;
  await reservation.save();

  res.json({ msg: "Reservation updated" });
});


module.exports = router;
