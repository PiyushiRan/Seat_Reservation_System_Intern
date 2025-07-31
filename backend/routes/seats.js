const express = require("express");
const router = express.Router();
const Seat = require("../models/Seat");
const auth = require("../middleware/auth");  // Changed from authenticate to auth
const Reservation = require("../models/Reservation");

// Get all seats
router.get("/", async (req, res) => {
  try {
    const seats = await Seat.find();
    res.json(seats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new seat (Admin only)
router.post("/", auth, async (req, res) => {
  // Add admin check
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden - Admin access required" });
  }

  const seat = new Seat({
    number: req.body.number,
    location: req.body.location,
    status: req.body.status || "available"
  });

  try {
    const newSeat = await seat.save();
    res.status(201).json(newSeat);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete seat (Admin only)
router.delete("/:id", auth, async (req, res) => {
  // Add admin check
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden - Admin access required" });
  }

  try {
    const seat = await Seat.findByIdAndDelete(req.params.id);
    if (!seat) {
      return res.status(404).json({ message: "Seat not found" });
    }
    res.json({ message: "Seat deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/available", auth, async (req, res) => {
  const { date, timeSlot } = req.query;

  if (!date || !timeSlot) {
    return res.status(400).json({ message: "Date and timeSlot required" });
  }

  try {
    // Find all reserved seats for that date and slot
    const reserved = await Reservation.find({ date, timeSlot }).select("seat");
    const reservedSeatIds = reserved.map((r) => r.seat.toString());

    // Return all seats not in the reserved list
    const availableSeats = await Seat.find({
      _id: { $nin: reservedSeatIds }
    });

    res.json(availableSeats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// After your existing routes in the seat router file

router.get("/status", auth, async (req, res) => {
  const { date, timeSlot } = req.query;
  if (!date || !timeSlot) return res.status(400).json({ message: "Date and timeSlot required" });

  try {
    const seats = await Seat.find();
    const reservations = await Reservation.find({ date, timeSlot });

    const result = seats.map((seat) => {
      const reservation = reservations.find((r) => r.seat.toString() === seat._id.toString());

      let status = "available";
      if (reservation) {
        if (reservation.intern.toString() === req.user.id) {
          status = "reserved-by-me";
        } else {
          status = "unavailable";
        }
      }

      return {
        ...seat.toObject(),
        status,
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Update seat (Admin only)
router.put("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden - Admin access required" });
  }

  try {
    const updatedSeat = await Seat.findByIdAndUpdate(
      req.params.id,
      {
        number: req.body.number,
        location: req.body.location,
        status: req.body.status,
      },
      { new: true }
    );

    if (!updatedSeat) {
      return res.status(404).json({ message: "Seat not found" });
    }

    res.json(updatedSeat);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



module.exports = router;