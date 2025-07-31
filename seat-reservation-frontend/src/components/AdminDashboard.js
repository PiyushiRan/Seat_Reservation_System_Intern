import React, { useEffect, useState } from "react";
import API from "../api";
import SeatList from "./SeatList";
import Reservations from "./Reservations";
import { useNavigate } from "react-router-dom";
import SeatUsageReport from "./SeatUsageReport";
import { 
  Container, Box, Typography, Button, Paper, Grid, TextField, Divider, 
  Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, 
  DialogContent, DialogActions, Card, CardContent, IconButton, Fade, Zoom
} from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

export default function AdminDashboard() {
  const [seats, setSeats] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [seat, setSeat] = useState({ number: "", location: "" });
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editSeatId, setEditSeatId] = useState(null);
  const [manualAssign, setManualAssign] = useState({
    internId: "",
    seatId: "",
    date: null,
    timeSlot: null
  });
  const [interns, setInterns] = useState([]);
  const [showReport, setShowReport] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const fetchSeats = async () => {
    const { data } = await API.get("/seats");
    setSeats(data);
  };

  const fetchReservations = async () => {
    const { data } = await API.get("/reservations/all");
    setReservations(data);
  };

  const fetchInterns = async () => {
    const { data } = await API.get("/auth/interns");
    setInterns(data);
  };

  const submitSeat = async () => {
    if (isEditing) {
      await API.put(`/seats/${editSeatId}`, seat);
    } else {
      await API.post("/seats", seat);
    }
    setSeat({ number: "", location: "" });
    setIsEditing(false);
    setEditSeatId(null);
    fetchSeats();
  };

  const assignSeat = async () => {
    try {
      const formattedDate = manualAssign.date.toISOString().split('T')[0];
      const formattedTime = manualAssign.timeSlot.getHours();

      await API.post("/reservations/assign", {
        ...manualAssign,
        date: formattedDate,
        timeSlot: formattedTime
      });

      alert("Seat assigned successfully");

      setManualAssign({ 
        internId: "", 
        seatId: "", 
        date: null, 
        timeSlot: null 
      });

      setOpenDialog(false);

      // ✅ Refresh seats and reservations after assignment
      fetchSeats();
      fetchReservations();

    } catch (err) {
      alert(err.response?.data?.message || "Failed to assign seat");
    }
  };

  const deleteSeat = async (id) => {
    if (window.confirm("Are you sure you want to delete this seat?")) {
      await API.delete(`/seats/${id}`);
      fetchSeats();
    }
  };

  const startEditing = (seat) => {
    setSeat({ number: seat.number, location: seat.location });
    setIsEditing(true);
    setEditSeatId(seat._id);
  };
  

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    fetchSeats();
    fetchReservations();
    fetchInterns();
  }, []);

  return (
    <>
      <style>
        {`
          /* Global Styles */
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
          
          * {
            box-sizing: border-box;
          }

          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            min-height: 100vh;
            margin: 0;
            padding: 0;
          }

          /* Animated Background */
          body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
              radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 2px, transparent 2px),
              radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 1px, transparent 1px);
            background-size: 60px 60px;
            animation: float 20s ease-in-out infinite;
            pointer-events: none;
            z-index: -1;
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(2deg); }
          }

          /* Container Styles */
          .MuiContainer-root {
            backdrop-filter: blur(10px) !important;
            padding: 32px !important;
            min-height: 100vh;
          }

          /* Header Styles */
          .MuiTypography-h4 {
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            background-clip: text !important;
            font-weight: 800 !important;
            letter-spacing: -0.02em !important;
            text-shadow: 0 4px 8px rgba(0,0,0,0.1) !important;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1)) !important;
          }

          /* Enhanced Seat Management Form Styles */
          .seat-management-card {
            background: linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.95) 100%) !important;
            backdrop-filter: blur(25px) !important;
            border-radius: 32px !important;
            border: 2px solid rgba(255,255,255,0.3) !important;
            box-shadow: 
              0 32px 80px rgba(15, 23, 42, 0.12), 
              0 12px 32px rgba(15, 23, 42, 0.08),
              inset 0 1px 0 rgba(255,255,255,0.5) !important;
            transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1) !important;
            position: relative !important;
            overflow: hidden !important;
          }

          .seat-management-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 5px;
            background: linear-gradient(90deg, #4f46e5, #7c3aed, #06b6d4, #10b981, #f59e0b, #ef4444);
            background-size: 200% 100%;
            animation: gradientMove 3s ease-in-out infinite;
          }

          @keyframes gradientMove {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }

          .seat-management-card:hover {
            transform: translateY(-8px) scale(1.02) !important;
            box-shadow: 
              0 48px 120px rgba(15, 23, 42, 0.16), 
              0 20px 48px rgba(15, 23, 42, 0.12),
              inset 0 1px 0 rgba(255,255,255,0.6) !important;
            border-color: rgba(255,255,255,0.4) !important;
          }

          .seat-form-header {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%) !important;
            margin: -24px -24px 32px -24px !important;
            padding: 32px 24px 24px 24px !important;
            border-radius: 32px 32px 0 0 !important;
            border-bottom: 2px solid rgba(226, 232, 240, 0.5) !important;
            position: relative !important;
          }

          .seat-form-header::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 4px;
            background: linear-gradient(90deg, #4f46e5, #7c3aed);
            border-radius: 2px;
          }

          .seat-form-title {
            display: flex !important;
            align-items: center !important;
            gap: 12px !important;
            font-weight: 800 !important;
            font-size: 24px !important;
            background: linear-gradient(135deg, #1e293b 0%, #475569 100%) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            background-clip: text !important;
            letter-spacing: -0.02em !important;
          }

          .seat-form-icon {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%) !important;
            color: white !important;
            padding: 12px !important;
            border-radius: 16px !important;
            box-shadow: 0 8px 25px rgba(79, 70, 229, 0.3) !important;
          }

          /* Enhanced Input Fields */
          .seat-input-container {
            position: relative !important;
            margin-bottom: 24px !important;
          }

          .seat-input-container .MuiTextField-root {
            width: 100% !important;
          }

          .seat-input-container .MuiOutlinedInput-root {
            background: linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%) !important;
            border-radius: 16px !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            border: 2px solid rgba(226, 232, 240, 0.6) !important;
            font-size: 16px !important;
            font-weight: 500 !important;
          }

          .seat-input-container .MuiOutlinedInput-root:hover {
            background: linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(248,250,252,0.95) 100%) !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08) !important;
            border-color: rgba(99, 102, 241, 0.4) !important;
          }

          .seat-input-container .MuiOutlinedInput-root.Mui-focused {
            background: rgba(255, 255, 255, 1) !important;
            transform: translateY(-3px) !important;
            box-shadow: 
              0 0 0 4px rgba(99, 102, 241, 0.1),
              0 16px 48px rgba(0, 0, 0, 0.12) !important;
            border-color: #4f46e5 !important;
          }

          .seat-input-container .MuiOutlinedInput-notchedOutline {
            border: none !important;
          }

          .seat-input-container .MuiInputLabel-root {
            font-weight: 600 !important;
            color: #64748b !important;
            font-size: 14px !important;
            transform: translate(16px, 16px) scale(1) !important;
          }

          .seat-input-container .MuiInputLabel-root.Mui-focused,
          .seat-input-container .MuiInputLabel-root.MuiFormLabel-filled {
            color: #4f46e5 !important;
            font-weight: 700 !important;
            transform: translate(16px, -9px) scale(0.85) !important;
          }

          /* Input Icons */
          .input-icon {
            position: absolute !important;
            right: 16px !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            color: #94a3b8 !important;
            pointer-events: none !important;
            z-index: 1 !important;
          }

          .seat-input-container:hover .input-icon {
            color: #4f46e5 !important;
          }

          .seat-input-container .MuiOutlinedInput-root.Mui-focused ~ .input-icon {
            color: #4f46e5 !important;
          }

          /* Enhanced Action Buttons */
          .seat-action-buttons {
            display: flex !important;
            gap: 16px !important;
            margin-top: 32px !important;
            padding-top: 24px !important;
            border-top: 2px solid rgba(226, 232, 240, 0.3) !important;
          }

          .seat-primary-button {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%) !important;
            color: white !important;
            border: none !important;
            border-radius: 16px !important;
            padding: 16px 32px !important;
            font-weight: 700 !important;
            font-size: 16px !important;
            text-transform: none !important;
            letter-spacing: 0.3px !important;
            box-shadow: 
              0 12px 30px rgba(79, 70, 229, 0.3),
              0 4px 12px rgba(79, 70, 229, 0.2) !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            position: relative !important;
            overflow: hidden !important;
            flex: 1 !important;
          }

          .seat-primary-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
          }

          .seat-primary-button:hover::before {
            left: 100%;
          }

          .seat-primary-button:hover {
            transform: translateY(-3px) scale(1.05) !important;
            box-shadow: 
              0 20px 50px rgba(79, 70, 229, 0.4),
              0 8px 20px rgba(79, 70, 229, 0.3) !important;
            background: linear-gradient(135deg, #4338ca 0%, #6d28d9 100%) !important;
          }

          .seat-secondary-button {
            background: linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%) !important;
            color: #475569 !important;
            border: 2px solid rgba(226, 232, 240, 0.8) !important;
            border-radius: 16px !important;
            padding: 16px 32px !important;
            font-weight: 600 !important;
            font-size: 16px !important;
            text-transform: none !important;
            letter-spacing: 0.3px !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            backdrop-filter: blur(10px) !important;
            flex: 1 !important;
          }

          .seat-secondary-button:hover {
            background: linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(248,250,252,0.95) 100%) !important;
            transform: translateY(-2px) scale(1.02) !important;
            box-shadow: 0 8px 25px rgba(71, 85, 105, 0.15) !important;
            border-color: rgba(99, 102, 241, 0.4) !important;
            color: #4f46e5 !important;
          }

          /* Button Icons */
          .button-icon {
            margin-right: 8px !important;
            font-size: 18px !important;
          }

          /* Form Animation */
          .seat-form-content {
            animation: slideInUp 0.6s cubic-bezier(0.23, 1, 0.32, 1) !important;
          }

          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(40px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* Success/Error States */
          .form-success {
            animation: successPulse 0.6s ease-out !important;
          }

          @keyframes successPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }

          .form-error {
            animation: shake 0.5s ease-in-out !important;
          }

          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
          }

          /* Rest of existing styles... */
          .MuiButton-contained {
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%) !important;
            border-radius: 12px !important;
            padding: 12px 24px !important;
            font-weight: 600 !important;
            text-transform: none !important;
            box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3) !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            border: none !important;
            letter-spacing: 0.3px !important;
          }

          .MuiButton-contained:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 15px 35px rgba(99, 102, 241, 0.4) !important;
            background: linear-gradient(135deg, #5855f3 0%, #4338ca 100%) !important;
          }

          .MuiButton-outlined {
            background: rgba(255, 255, 255, 0.15) !important;
            backdrop-filter: blur(10px) !important;
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            color: white !important;
            border-radius: 12px !important;
            padding: 12px 24px !important;
            font-weight: 600 !important;
            text-transform: none !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            letter-spacing: 0.3px !important;
          }

          .MuiButton-outlined:hover {
            background: rgba(255, 255, 255, 0.25) !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2) !important;
            border-color: rgba(255, 255, 255, 0.5) !important;
          }

          .MuiButton-colorError {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
            box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3) !important;
          }

          .MuiButton-colorError:hover {
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%) !important;
            box-shadow: 0 15px 35px rgba(239, 68, 68, 0.4) !important;
          }

          .MuiPaper-root {
            background: rgba(255, 255, 255, 0.95) !important;
            backdrop-filter: blur(20px) !important;
            border-radius: 24px !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08), 0 8px 24px rgba(15, 23, 42, 0.04) !important;
            transition: all 0.3s ease !important;
            overflow: hidden !important;
            position: relative !important;
          }

          .MuiPaper-root::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4, #10b981);
            opacity: 0.6;
          }

          .MuiPaper-root:hover {
            transform: translateY(-4px) !important;
            box-shadow: 0 32px 80px rgba(15, 23, 42, 0.12), 0 12px 32px rgba(15, 23, 42, 0.08) !important;
          }

          .MuiTypography-h5 {
            font-weight: 700 !important;
            color: #0f172a !important;
            margin-bottom: 24px !important;
            letter-spacing: -0.01em !important;
          }

          .MuiTextField-root {
            margin-bottom: 16px !important;
          }

          .MuiOutlinedInput-root {
            border-radius: 12px !important;
            background: rgba(255, 255, 255, 0.8) !important;
            backdrop-filter: blur(10px) !important;
            transition: all 0.3s ease !important;
          }

          .MuiOutlinedInput-root:hover {
            background: rgba(255, 255, 255, 0.9) !important;
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
          }

          .MuiOutlinedInput-root.Mui-focused {
            background: rgba(255, 255, 255, 1) !important;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1) !important;
          }

          .MuiOutlinedInput-notchedOutline {
            border-color: rgba(226, 232, 240, 0.8) !important;
            transition: all 0.3s ease !important;
          }

          .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
            border-color: rgba(99, 102, 241, 0.4) !important;
          }

          .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
            border-color: #6366f1 !important;
            border-width: 2px !important;
          }

          .MuiSelect-root {
            border-radius: 12px !important;
          }

          .MuiMenuItem-root {
            border-radius: 8px !important;
            margin: 4px 8px !important;
            transition: all 0.2s ease !important;
          }

          .MuiMenuItem-root:hover {
            background: rgba(99, 102, 241, 0.1) !important;
            transform: translateX(4px) !important;
          }

          .MuiMenuItem-root.Mui-selected {
            background: rgba(99, 102, 241, 0.15) !important;
            font-weight: 600 !important;
          }

          .MuiDialog-paper {
            border-radius: 24px !important;
            background: rgba(255, 255, 255, 0.98) !important;
            backdrop-filter: blur(20px) !important;
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            box-shadow: 0 32px 80px rgba(15, 23, 42, 0.15) !important;
          }

          .MuiDialogTitle-root {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%) !important;
            font-weight: 700 !important;
            color: #0f172a !important;
            letter-spacing: -0.01em !important;
            border-bottom: 1px solid rgba(226, 232, 240, 0.5) !important;
          }

          .MuiDialogContent-root {
            padding: 32px !important;
          }

          .MuiDialogActions-root {
            padding: 24px 32px !important;
            background: rgba(248, 250, 252, 0.5) !important;
            border-top: 1px solid rgba(226, 232, 240, 0.5) !important;
          }

          .MuiGrid-item {
            transition: all 0.3s ease !important;
          }

          .MuiFormControl-root {
            margin-bottom: 16px !important;
          }

          .MuiInputLabel-root {
            font-weight: 500 !important;
            color: #475569 !important;
          }

          .MuiInputLabel-root.Mui-focused {
            color: #6366f1 !important;
            font-weight: 600 !important;
          }

          .MuiBox-root {
            transition: all 0.3s ease !important;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          .MuiDialog-paper {
            animation: slideInUp 0.3s ease-out !important;
          }

          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }

          ::-webkit-scrollbar-track {
            background: rgba(241, 245, 249, 0.5);
            border-radius: 10px;
          }

          ::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            border-radius: 10px;
            transition: all 0.3s ease;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
          }

          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }

          .loading {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite !important;
          }

          @media (max-width: 768px) {
            .MuiContainer-root {
              padding: 16px !important;
            }
            
            .MuiPaper-root {
              border-radius: 16px !important;
              margin-bottom: 16px !important;
            }
            
            .MuiButton-root {
              padding: 10px 20px !important;
              font-size: 14px !important;
            }

            .seat-action-buttons {
              flex-direction: column !important;
            }
          }

          .MuiButton-root:focus-visible {
            outline: 2px solid #6366f1 !important;
            outline-offset: 2px !important;
          }

          .MuiTextField-root:focus-within,
          .MuiFormControl-root:focus-within {
            transform: translateY(-1px) !important;
          }
        `}
      </style>
      
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Container maxWidth="xl">
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
              Admin Dashboard
            </Typography>
            <Box>
              <Button
                variant="outlined"
                onClick={() => setShowReport(!showReport)}
                sx={{ mr: 2 }}
              >
                {showReport ? "Hide Report" : "View Seat Usage"}
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
          </Box>

          {showReport && (
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
              <SeatUsageReport />
            </Paper>
          )}

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Zoom in={true} timeout={500}>
                <Card className="seat-management-card" elevation={0}>
                  <CardContent sx={{ p: 3 }}>
                    <Box className="seat-form-header">
                      <Box className="seat-form-title">
                        <Box className="seat-form-icon">
                          {isEditing ? <EditIcon /> : <AddIcon />}
                        </Box>
                        <Typography variant="h5" component="h2">
                          {isEditing ? "Edit Seat" : "Add New Seat"}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box className="seat-form-content">
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <Box className="seat-input-container">
                            <TextField
                              label="Seat Number"
                              value={seat.number}
                              onChange={(e) => setSeat({ ...seat, number: e.target.value })}
                              fullWidth
                              variant="outlined"
                              placeholder="e.g., A-01, B-15"
                            />
                            <EventSeatIcon className="input-icon" />
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box className="seat-input-container">
                            <TextField
                              label="Location"
                              value={seat.location}
                              onChange={(e) => setSeat({ ...seat, location: e.target.value })}
                              fullWidth
                              variant="outlined"
                              placeholder="e.g., Floor 1, Wing A"
                            />
                            <LocationOnIcon className="input-icon" />
                          </Box>
                        </Grid>
                      </Grid>
                      
                      <Box className="seat-action-buttons">
                        <Button
                          className="seat-primary-button"
                          onClick={submitSeat}
                          disabled={!seat.number.trim() || !seat.location.trim()}
                        >
                          <SaveIcon className="button-icon" />
                          {isEditing ? "Update Seat" : "Add Seat"}
                        </Button>
                        {isEditing && (
                          <Fade in={isEditing}>
                            <Button
                              className="seat-secondary-button"
                              onClick={() => {
                                setSeat({ number: "", location: "" });
                                setIsEditing(false);
                                setEditSeatId(null);
                              }}
                            >
                              <CancelIcon className="button-icon" />
                              Cancel
                            </Button>
                          </Fade>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Zoom>

              <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" component="h2">
                    Seat Management
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => setOpenDialog(true)}
                  >
                    Manual Assignment
                  </Button>
                </Box>
                <SeatList seats={seats} onDelete={deleteSeat} onEdit={startEditing} role="admin" />
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
                <Reservations reservations={reservations} role="admin" />
            </Grid>
          </Grid>

          {/* Manual Assignment Dialog */}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Manual Seat Assignment</DialogTitle>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Select Intern</InputLabel>
                    <Select
                      value={manualAssign.internId}
                      onChange={(e) => setManualAssign({ ...manualAssign, internId: e.target.value })}
                      label="Select Intern"
                    >
                      <MenuItem value=""><em>None</em></MenuItem>
                      {interns.map((intern) => (
                        <MenuItem key={intern._id} value={intern._id}>
                          {intern.name} ({intern.email})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Select Seat</InputLabel>
                    <Select
                      value={manualAssign.seatId}
                      onChange={(e) => setManualAssign({ ...manualAssign, seatId: e.target.value })}
                      label="Select Seat"
                    >
                      <MenuItem value=""><em>None</em></MenuItem>
                      {seats.map((seat) => (
                        <MenuItem key={seat._id} value={seat._id}>
                          {seat.number} - {seat.location}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Select Date"
                    value={manualAssign.date}
                    onChange={(date) => setManualAssign({ ...manualAssign, date })}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TimePicker
                    label="Select Time"
                    value={manualAssign.timeSlot}
                    onChange={(time) => setManualAssign({ ...manualAssign, timeSlot: time })}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button 
                variant="contained" 
                onClick={assignSeat}
                disabled={!manualAssign.internId || !manualAssign.seatId || !manualAssign.date || !manualAssign.timeSlot}
              >
                Assign Seat
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </LocalizationProvider>
    </>
  );
}