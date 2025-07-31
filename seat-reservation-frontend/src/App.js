import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import InternDashboard from "./components/InternDashboard";
import AdminDashboard from "./components/AdminDashboard";

export default function App() {
  const role = localStorage.getItem("role");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      <Route
          path="/intern"
          element={role === "intern" ? <InternDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin"
          element={role === "admin" ? <AdminDashboard /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}
