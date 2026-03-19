import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Departments from "./pages/Departments";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <BrowserRouter>

      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>

        {/* PUBLIC */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* EMPLOYEES */}
        <Route
          path="/employees"
          element={
            <ProtectedRoute roles={["Admin", "HR", "User"]}>
              <Employees />
            </ProtectedRoute>
          }
        />

        {/* DEPARTMENTS */}
        <Route
          path="/departments"
          element={
            <ProtectedRoute roles={["Admin", "HR", "User"]}>
              <Departments />
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route
          path="*"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;