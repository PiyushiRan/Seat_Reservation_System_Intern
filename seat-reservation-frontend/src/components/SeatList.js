import React from "react";

export default function SeatList({ seats, onReserve, onDelete, onEdit, role }) {
  console.log("Seats passed to SeatList:", seats);
  return (
    <ul>
      {seats.map((seat) => (
        <li key={seat._id}>
          <strong>{seat.number}</strong> - {seat.location} 
          
          {role === "intern" && seat.status === "available" && (
            <button onClick={() => onReserve(seat._id)}>Reserve</button>
          )}

          {role === "intern" && seat.status === "reserved-by-me" && (
            <span style={{ marginLeft: 10, fontWeight: "bold" }}>Your reservation</span>
          )}

          {role === "intern" && seat.status === "unavailable" && (
            <span style={{ marginLeft: 10, color: "gray" }}>Unavailable</span>
          )}

          
          {role === "admin" && (
            <>
              <button onClick={() => onEdit(seat)} style={{ marginLeft: "10px" }}>
                Edit
              </button>
              <button onClick={() => onDelete(seat._id)} style={{ marginLeft: "10px" }}>
                Delete
              </button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
