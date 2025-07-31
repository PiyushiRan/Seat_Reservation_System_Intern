const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");
const Seat = require("../models/Seat");
const auth = require("../middleware/auth");

router.get("/seat-usage", auth, async (req, res) => {
  if (req.user.role !== "admin") 
    return res.status(403).json({ message: "Forbidden" });

  try {
    // Aggregate reservation counts grouped by seat and collect reservation details
    const usage = await Reservation.aggregate([
      {
        $group: {
          _id: "$seat",
          totalReservations: { $sum: 1 },
          assignedCount: { $sum: { $cond: [{ $eq: ["$status", "assigned"] }, 1, 0] } },
          activeCount: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
          cancelledCount: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] } },
          reservations: {
            $push: {
              date: "$date",
              timeSlot: "$timeSlot",
              status: "$status"
            }
          }
        }
      },
      {
        $lookup: {
          from: "seats",
          localField: "_id",
          foreignField: "_id",
          as: "seatDetails"
        }
      },
      { $unwind: "$seatDetails" },
      {
        $project: {
          seatNumber: "$seatDetails.number",
          seatLocation: "$seatDetails.location",
          totalReservations: 1,
          assignedCount: 1,
          activeCount: 1,
          cancelledCount: 1,
          reservations: 1
        }
      },
      { $sort: { totalReservations: -1 } }
    ]);

    res.json(usage);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
