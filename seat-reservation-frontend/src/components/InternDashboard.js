import React, { useEffect, useState } from "react";
import API from "../api";
import SeatList from "./SeatList";
import Reservations from "./Reservations";
import { useNavigate } from "react-router-dom";
import { Container, Box, Typography, Button, Paper, Grid, TextField, Divider } from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Calendar, Clock, MapPin, LogOut, Search, Sparkles, Users, Coffee, Wifi, CheckCircle2, XCircle } from "lucide-react";
export default function InternDashboard() {
  const [seats, setSeats] = useState([]);
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();
  const [filterDate, setFilterDate] = useState(null);
  const [filterTime, setFilterTime] = useState(null);
  const [showAvailableSeats, setShowAvailableSeats] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const fetchSeats = async () => {
    const { data } = await API.get("/seats");
    setSeats(data);
  };

  const fetchReservations = async () => {
    const { data } = await API.get("/reservations/my");
    setReservations(data);
  };

  const reserveSeat = async (seatId) => {
  if (!filterDate || !filterTime) {
    alert("Please select a date and time before reserving.");
    return;
  }

  const formattedDate = filterDate.toISOString().split("T")[0];
  const formattedTime = filterTime.getHours();

  try {
    await API.post("/reservations/book", {
      seatId,
      date: formattedDate,
      timeSlot: formattedTime,
    });

    alert("Seat reserved successfully!");
    
    // Refresh both reservations and available seats
    fetchReservations();
    fetchAvailableSeats();  // important for real-time updates
  } catch (err) {
    alert(err.response?.data?.message || "Reservation failed");
  }
};


  const cancelReservation = async (id) => {
    if (window.confirm("Are you sure you want to cancel this reservation?")) {
      await API.delete(`/reservations/${id}`);
      fetchReservations();
    }
  };

  useEffect(() => {
    fetchSeats();
    fetchReservations();
  }, []);

  const fetchAvailableSeats = async () => {
  if (!filterDate || !filterTime) {
    alert("Please select both date and time");
    return;
  }
  setLoading(true);
  const now = new Date();

  // Normalize selected date/time to compare
  const selectedDate = new Date(filterDate);
  const selectedHour = filterTime.getHours();

  selectedDate.setHours(selectedHour, 0, 0, 0);

  if (selectedDate <= now) {
    alert("Cannot check availability for past date or time.");
    setShowAvailableSeats(false);
    return;
  }

  const formattedDate = filterDate.toISOString().split('T')[0];
  const formattedTime = filterTime.getHours();

  try {
    const { data } = await API.get(
      `/seats/status?date=${formattedDate}&timeSlot=${formattedTime}`
    );
    setSeats(data);
    setShowAvailableSeats(true);
    } catch (err) {
      console.error("Error fetching available seats:", err.response?.data || err.message);
      setShowAvailableSeats(false);
    }
  };



  const modifyReservation = async (res) => {
    const newDate = prompt("Enter new date (YYYY-MM-DD):", res.date?.slice(0, 10));
    const newTime = prompt("Enter new time (e.g., 10):", res.timeSlot);
    const newSeat = prompt("Enter new seat ID:", res.seat?._id || "");

    try {
      await API.put(`/reservations/${res._id}`, {
        date: newDate,
        timeSlot: newTime,
        seatId: newSeat,
      });
      alert("Reservation updated successfully");
      fetchReservations();
    } catch (err) {
      alert(err.response?.data || "Update failed");
    }
  };

   const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "32px",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    },
    backgroundPattern: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `
        radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 2px, transparent 2px),
        radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 1px, transparent 1px)
      `,
      backgroundSize: "60px 60px",
      animation: "float 20s ease-in-out infinite",
      pointerEvents: "none"
    },
    contentWrapper: {
      position: "relative",
      zIndex: 1,
      maxWidth: "1400px",
      margin: "0 auto"
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "40px"
    },
    title: {
      fontSize: "36px",
      fontWeight: "800",
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      letterSpacing: "-0.02em",
      display: "flex",
      alignItems: "center",
      gap: "16px"
    },
    logoutButton: {
      padding: "12px 24px",
      borderRadius: "16px",
      border: "none",
      background: "rgba(255, 255, 255, 0.2)",
      backdropFilter: "blur(10px)",
      color: "white",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      gap: "8px"
    },
    searchCard: {
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      borderRadius: "24px",
      padding: "32px",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
      marginBottom: "32px"
    },
    searchTitle: {
      fontSize: "24px",
      fontWeight: "700",
      color: "#1e293b",
      marginBottom: "24px",
      display: "flex",
      alignItems: "center",
      gap: "12px"
    },
    searchForm: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr auto",
      gap: "20px",
      alignItems: "end"
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "8px"
    },
    label: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#374151",
      display: "flex",
      alignItems: "center",
      gap: "6px"
    },
    input: {
      width: "100%",
      padding: "14px 16px",
      borderRadius: "12px",
      border: "2px solid #e5e7eb",
      fontSize: "16px",
      transition: "all 0.3s ease",
      outline: "none",
      background: "white"
    },
    searchButton: {
      padding: "14px 28px",
      borderRadius: "12px",
      border: "none",
      background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
      color: "white",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      height: "fit-content"
    },
    mainGrid: {
      display: "grid",
      gridTemplateColumns: showAvailableSeats ? "1fr 1fr" : "1fr",
      gap: "32px"
    },
    card: {
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      borderRadius: "24px",
      padding: "32px",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)"
    },
    cardTitle: {
      fontSize: "24px",
      fontWeight: "700",
      color: "#1e293b",
      marginBottom: "24px",
      display: "flex",
      alignItems: "center",
      gap: "12px"
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "20px",
      marginBottom: "32px"
    },
    statCard: {
      background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
      borderRadius: "16px",
      padding: "20px",
      border: "1px solid rgba(226, 232, 240, 0.8)",
      display: "flex",
      alignItems: "center",
      gap: "16px"
    },
    statIcon: {
      padding: "12px",
      borderRadius: "12px",
      background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
      color: "white"
    },
    statValue: {
      fontSize: "24px",
      fontWeight: "800",
      color: "#1e293b",
      margin: 0
    },
    statLabel: {
      fontSize: "14px",
      color: "#64748b",
      margin: 0
    }
  };

  return (
     <>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(2deg); }
          }
          
          input:focus {
            border-color: #6366f1 !important;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1) !important;
          }
          
          button:hover {
            transform: translateY(-2px);
          }
          
          @media (max-width: 768px) {
            .search-form {
              grid-template-columns: 1fr !important;
            }
            .main-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div style={styles.container}>
        <div style={styles.backgroundPattern}></div>
        
        <div style={styles.contentWrapper}>
          <div style={styles.header}>
            <h1 style={styles.title}>
              <Sparkles size={32} />
              Intern Dashboard
            </h1>
          
          <Button
          style={styles.logoutButton}
            variant="contained"
            color="error"
            onClick={handleLogout}
            >
               <LogOut size={16} />
            Logout
          </Button>
        </div>
      </div>


        {/* Stats Overview */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>
                <Users size={20} />
              </div>
              <div>
                <p style={styles.statValue}>{reservations.length}</p>
                <p style={styles.statLabel}>My Reservations</p>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>
                <Coffee size={20} />
              </div>
              <div>
                <p style={styles.statValue}>23</p>
                <p style={styles.statLabel}>Available Seats</p>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>
                <Wifi size={20} />
              </div>
              <div>
                <p style={styles.statValue}>98%</p>
                <p style={styles.statLabel}>Uptime</p>
              </div>
            </div>
          </div>

         <div style={styles.searchCard}>
          <h2 style={styles.searchTitle}>
              <Search size={24} />
              Find Available Seats
            </h2>
          <div style={styles.searchForm} className="search-form">
            <div style={styles.inputGroup}>
              <DatePicker
                label="Select Date"
                value={filterDate}
                onChange={setFilterDate}
                slotProps={{ textField: { fullWidth: true } }}
                style={styles.label}
              />
            </div>
            <div style={styles.inputGroup}>
              <TimePicker
                label="Select Time"
                value={filterTime}
                onChange={setFilterTime}
                slotProps={{ textField: { fullWidth: true } }}
                style={styles.label}
              />
            </div>
             <button
                style={styles.searchButton}
                onClick={fetchAvailableSeats}
                disabled={loading}
              >
                <Search size={16} />
                {loading ? "Searching..." : "Check Availability"}
              </button>
            
          </div>
        </div>

       <div style={styles.mainGrid} className="main-grid">
  {showAvailableSeats && (
    <div style={styles.card}>
        <h2 style={styles.cardTitle}>
                  <MapPin size={24} />
                  Available Seats
                </h2>
        <SeatList seats={seats} onReserve={reserveSeat} role="intern" />
    </div>
  )}
  </div>
  
              <Reservations 
                reservations={reservations} 
                onCancel={cancelReservation}
                onModify={modifyReservation}
                role="intern" 
              />
          
</div>
    </LocalizationProvider>
    </>
  );
}