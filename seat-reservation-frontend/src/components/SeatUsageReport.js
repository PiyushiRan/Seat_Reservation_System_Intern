import React, { useEffect, useState } from "react";
import API from "../api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function SeatUsageReport() {
  const [usage, setUsage] = useState([]);

  const fetchUsage = async () => {
    try {
      const { data } = await API.get("/reports/seat-usage");
      setUsage(data);
    } catch (err) {
      alert("Failed to load seat usage report");
    }
  };

  useEffect(() => {
    fetchUsage();
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Seat Usage Report", 14, 22);

    const tableColumn = [
      "Seat Number",
      "Location",
      "Total Reservations",
      "Assigned",
      "Active",
      "Cancelled",
      "Reservations (Date & Time)"
    ];

    const tableRows = usage.map((item) => {
      const reservationsStr = (item.reservations || [])
        .map(
          (r) =>
            `${new Date(r.date).toLocaleDateString()} @ ${r.timeSlot}:00 (${r.status})`
        )
        .join("\n");

      return [
        item.seatNumber,
        item.seatLocation,
        item.totalReservations,
        item.assignedCount,
        item.activeCount,
        item.cancelledCount,
        reservationsStr
      ];
    });

    autoTable(doc, {
      startY: 30,
      head: [tableColumn],
      body: tableRows,
      styles: { cellWidth: 'wrap' },
      columnStyles: {
        6: { cellWidth: 60 }, // Wider column for reservations
      },
    });

    doc.save("seat-usage-report.pdf");
  };

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <h3 style={{
        color: '#2c3e50',
        marginBottom: '20px',
        fontSize: '28px',
        fontWeight: 'bold',
        textAlign: 'center',
        borderBottom: '3px solid #3498db',
        paddingBottom: '10px'
      }}>
        Seat Usage Report
      </h3>
      
      <button 
        onClick={generatePDF}
        style={{
          backgroundColor: '#3498db',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          fontSize: '16px',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '20px',
          fontWeight: 'bold',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          transition: 'background-color 0.3s'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
      >
        Download PDF
      </button>

      {usage.length === 0 ? (
        <p style={{
          textAlign: 'center',
          color: '#7f8c8d',
          fontSize: '16px',
          fontStyle: 'italic',
          padding: '40px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          No usage data available.
        </p>
      ) : (
        <div style={{
          overflowX: 'auto',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0'
        }}>
          <table
            border="1"
            cellPadding="8"
            style={{ 
              borderCollapse: "collapse", 
              width: "100%",
              fontSize: '14px'
            }}
          >
            <thead style={{
              backgroundColor: '#34495e',
              color: 'white'
            }}>
              <tr>
                <th style={{
                  padding: '15px 12px',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '2px solid #2c3e50'
                }}>
                  Seat Number
                </th>
                <th style={{
                  padding: '15px 12px',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '2px solid #2c3e50'
                }}>
                  Location
                </th>
                <th style={{
                  padding: '15px 12px',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '2px solid #2c3e50'
                }}>
                  Total Reservations
                </th>
                <th style={{
                  padding: '15px 12px',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '2px solid #2c3e50'
                }}>
                  Assigned
                </th>
                <th style={{
                  padding: '15px 12px',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '2px solid #2c3e50'
                }}>
                  Active
                </th>
                <th style={{
                  padding: '15px 12px',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '2px solid #2c3e50'
                }}>
                  Cancelled
                </th>
                <th style={{
                  padding: '15px 12px',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '2px solid #2c3e50'
                }}>
                  Reservations (Date & Time)
                </th>
              </tr>
            </thead>
            <tbody>
              {usage.map((item, index) => (
                <tr 
                  key={item._id}
                  style={{
                    backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e8f4f8'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#f8f9fa' : 'white'}
                >
                  <td style={{
                    padding: '12px',
                    borderBottom: '1px solid #dee2e6',
                    textAlign: 'center',
                    fontWeight: 'bold'
                  }}>
                    {item.seatNumber}
                  </td>
                  <td style={{
                    padding: '12px',
                    borderBottom: '1px solid #dee2e6'
                  }}>
                    {item.seatLocation}
                  </td>
                  <td style={{
                    padding: '12px',
                    borderBottom: '1px solid #dee2e6',
                    textAlign: 'center',
                    fontWeight: 'bold'
                  }}>
                    {item.totalReservations}
                  </td>
                  <td style={{
                    padding: '12px',
                    borderBottom: '1px solid #dee2e6',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: '#f39c12'
                  }}>
                    {item.assignedCount}
                  </td>
                  <td style={{
                    padding: '12px',
                    borderBottom: '1px solid #dee2e6',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: '#27ae60'
                  }}>
                    {item.activeCount}
                  </td>
                  <td style={{
                    padding: '12px',
                    borderBottom: '1px solid #dee2e6',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: '#e74c3c'
                  }}>
                    {item.cancelledCount}
                  </td>
                  <td style={{ 
                    whiteSpace: "pre-line",
                    padding: '12px',
                    borderBottom: '1px solid #dee2e6',
                    fontSize: '12px',
                    lineHeight: '1.4',
                    maxWidth: '200px'
                  }}>
                    {(item.reservations || [])
                      .map(
                        (r) =>
                          `${new Date(r.date).toLocaleDateString()} @ ${r.timeSlot}:00 (${r.status})`
                      )
                      .join("\n")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}