import React from "react";
import { Calendar, Clock, User, Armchair, Sparkles } from "lucide-react";

export default function Reservations({ reservations = [], onCancel = () => {}, onModify = () => {}, role = "intern" }) {
  const now = new Date();

  const styles = {
    container: {
      padding: "32px",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      minHeight: "100vh",
      position: "relative",
      overflow: "hidden"
    },
    backgroundPattern: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `
        radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 2px, transparent 2px),
        radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 1px, transparent 1px)
      `,
      backgroundSize: "60px 60px",
      animation: "float 20s ease-in-out infinite"
    },
    contentWrapper: {
      position: "relative",
      zIndex: 1,
      maxWidth: "1000px",
      margin: "0 auto"
    },
    header: {
      fontSize: "36px",
      fontWeight: "800",
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      marginBottom: "8px",
      textAlign: "center",
      letterSpacing: "-0.02em"
    },
    subtitle: {
      fontSize: "16px",
      color: "rgba(255, 255, 255, 0.8)",
      textAlign: "center",
      marginBottom: "40px",
      fontWeight: "400"
    },
    list: {
      listStyle: "none",
      padding: 0,
      margin: 0,
      display: "grid",
      gap: "24px"
    },
    reservationItem: {
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      padding: "32px",
      borderRadius: "24px",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.08)",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      position: "relative",
      overflow: "hidden",
      cursor: "pointer"
    },
    reservationItemHover: {
      transform: "translateY(-8px) scale(1.02)",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1)",
      background: "rgba(255, 255, 255, 1)"
    },
    noReservations: {
      textAlign: "center",
      padding: "80px 40px",
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      borderRadius: "24px",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)"
    },
    noReservationsIcon: {
      marginBottom: "16px",
      opacity: 0.6
    },
    noReservationsText: {
      color: "#64748b",
      fontSize: "18px",
      fontWeight: "500"
    },
    reservationContent: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "24px"
    },
    reservationInfo: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      flex: 1
    },
    seatNumber: {
      fontSize: "24px",
      fontWeight: "700",
      color: "#1e293b",
      margin: 0,
      display: "flex",
      alignItems: "center",
      gap: "10px"
    },
    dateTime: {
      fontSize: "15px",
      color: "#64748b",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      fontWeight: "500"
    },
    internName: {
      fontSize: "20px",
      fontWeight: "700",
      color: "#3730a3",
      margin: 0,
      display: "flex",
      alignItems: "center",
      gap: "10px"
    },
    statusContainer: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      flexWrap: "wrap"
    },
    button: {
      padding: "12px 24px",
      borderRadius: "16px",
      border: "none",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      outline: "none",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      position: "relative",
      overflow: "hidden"
    },
    cancelButton: {
      background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      color: "white",
      boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)"
    },
    cancelButtonHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 8px 24px rgba(239, 68, 68, 0.4)"
    },
    modifyButton: {
      background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
      color: "white",
      boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)"
    },
    modifyButtonHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 8px 24px rgba(139, 92, 246, 0.4)"
    },
    disabledButton: {
      background: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)",
      color: "#94a3b8",
      cursor: "not-allowed",
      opacity: 0.7
    },
    statusBadge: {
      padding: "8px 16px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.3)"
    },
    activeBadge: {
      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      color: "white",
      boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)"
    },
    expiredBadge: {
      background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      color: "white",
      boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)"
    },
    cancelledBadge: {
      background: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
      color: "white",
      boxShadow: "0 4px 12px rgba(107, 114, 128, 0.3)"
    },
    statusIndicator: {
      width: "10px",
      height: "10px",
      borderRadius: "50%",
      display: "inline-block",
      boxShadow: "0 0 8px rgba(255, 255, 255, 0.5)"
    },
    activeIndicator: {
      backgroundColor: "#ffffff"
    },
    expiredIndicator: {
      backgroundColor: "#ffffff"
    },
    cancelledIndicator: {
      backgroundColor: "#ffffff"
    },
    leftAccent: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: "6px",
      borderRadius: "0 4px 4px 0"
    },
    activeAccent: {
      background: "linear-gradient(to bottom, #10b981, #059669)"
    },
    expiredAccent: {
      background: "linear-gradient(to bottom, #ef4444, #dc2626)"
    },
    cancelledAccent: {
      background: "linear-gradient(to bottom, #6b7280, #4b5563)"
    },
    shimmer: {
      position: "absolute",
      top: 0,
      left: "-100%",
      width: "100%",
      height: "100%",
      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
      animation: "shimmer 2s infinite"
    },
    iconWrapper: {
      padding: "8px",
      borderRadius: "12px",
      background: "rgba(99, 102, 241, 0.1)"
    }
  };

  const [hoveredItem, setHoveredItem] = React.useState(null);
  const [hoveredButton, setHoveredButton] = React.useState(null);

  const getStatusInfo = (res, isExpired) => {
    if (isExpired) {
      return {
        badge: { ...styles.statusBadge, ...styles.expiredBadge },
        indicator: { ...styles.statusIndicator, ...styles.expiredIndicator },
        accent: { ...styles.leftAccent, ...styles.expiredAccent },
        text: "Expired"
      };
    } else if (res.status === "cancelled") {
      return {
        badge: { ...styles.statusBadge, ...styles.cancelledBadge },
        indicator: { ...styles.statusIndicator, ...styles.cancelledIndicator },
        accent: { ...styles.leftAccent, ...styles.cancelledAccent },
        text: "Cancelled"
      };
    } else {
      return {
        badge: { ...styles.statusBadge, ...styles.activeBadge },
        indicator: { ...styles.statusIndicator, ...styles.activeIndicator },
        accent: { ...styles.leftAccent, ...styles.activeAccent },
        text: "Active"
      };
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
          
          @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
        `}
      </style>
      
      <div style={styles.container}>
        <div style={styles.backgroundPattern}></div>
        
        <div style={styles.contentWrapper}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "16px" }}>
            <Sparkles size={32} color="white" />
            <h1 style={styles.header}>
              {role === "intern" ? "My Reservations" : "All Reservations"}
            </h1>
          </div>
          
          <p style={styles.subtitle}>
            {role === "intern" 
              ? "Manage your workspace reservations" 
              : "Overview of all reservation activities"
            }
          </p>

          <ul style={styles.list}>
            {reservations.length === 0 && (
              <li style={styles.noReservations}>
                <div style={styles.noReservationsIcon}>
                  <Calendar size={48} color="#94a3b8" />
                </div>
                <div style={styles.noReservationsText}>No reservations found</div>
              </li>
            )}

            {reservations.map((res) => {
              const resDate = new Date(res.date);
              resDate.setHours(parseInt(res.timeSlot), 0, 0, 0);
              const isExpired = resDate < now;
              const statusInfo = getStatusInfo(res, isExpired);

              return (
                <li
                  key={res._id}
                  style={{
                    ...styles.reservationItem,
                    ...(hoveredItem === res._id ? styles.reservationItemHover : {})
                  }}
                  onMouseEnter={() => setHoveredItem(res._id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div style={statusInfo.accent}></div>
                  {hoveredItem === res._id && <div style={styles.shimmer}></div>}

                  <div style={styles.reservationContent}>
                    <div style={styles.reservationInfo}>
                      {role === "intern" ? (
                        <>
                          <h3 style={styles.seatNumber}>
                            <div style={styles.iconWrapper}>
                              <Armchair size={20} color="#6366f1" />
                            </div>
                            Seat {res.seat?.number || "N/A"}
                          </h3>
                          <div style={styles.dateTime}>
                            <Calendar size={16} />
                            {new Date(res.date).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                            <span style={{ color: "#d1d5db" }}>•</span>
                            <Clock size={16} />
                            {res.timeSlot}:00
                          </div>
                        </>
                      ) : (
                        <>
                          <h3 style={styles.internName}>
                            <div style={styles.iconWrapper}>
                              <User size={20} color="#6366f1" />
                            </div>
                            {res.intern?.name || "Unknown Intern"}
                          </h3>
                          <div style={styles.dateTime}>
                            <Armchair size={16} />
                            Seat {res.seat?.number || "N/A"}
                            <span style={{ color: "#d1d5db" }}>•</span>
                            <Calendar size={16} />
                            {new Date(res.date).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                            <span style={{ color: "#d1d5db" }}>•</span>
                            <Clock size={16} />
                            {res.timeSlot}:00
                          </div>
                        </>
                      )}
                    </div>

                    <div style={styles.statusContainer}>
                      <span style={statusInfo.badge}>
                        <span style={statusInfo.indicator}></span>
                        {statusInfo.text}
                      </span>

                      {role === "intern" && (
                        <div style={{ display: "flex", gap: "12px" }}>
                          {isExpired || res.status === "cancelled" ? (
                            <button
                              disabled
                              style={{ ...styles.button, ...styles.disabledButton }}
                            >
                              {isExpired ? "Expired" : "Cancelled"}
                            </button>
                          ) : (
                            <>
                              <button
                                style={{
                                  ...styles.button,
                                  ...styles.cancelButton,
                                  ...(hoveredButton === `cancel-${res._id}` ? styles.cancelButtonHover : {})
                                }}
                                onMouseEnter={() => setHoveredButton(`cancel-${res._id}`)}
                                onMouseLeave={() => setHoveredButton(null)}
                                onClick={() => onCancel(res._id)}
                              >
                                Cancel
                              </button>
                              <button
                                style={{
                                  ...styles.button,
                                  ...styles.modifyButton,
                                  ...(hoveredButton === `modify-${res._id}` ? styles.modifyButtonHover : {})
                                }}
                                onMouseEnter={() => setHoveredButton(`modify-${res._id}`)}
                                onMouseLeave={() => setHoveredButton(null)}
                                onClick={() => onModify(res)}
                              >
                                Modify
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}