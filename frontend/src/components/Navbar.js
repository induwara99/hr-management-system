import React from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  Avatar,
  IconButton
} from "@mui/material";

import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";

import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔐 Get username from JWT
  const token = localStorage.getItem("token");

  let username = "User";

  try {
    if (token) {
      const decoded = jwtDecode(token);

      // handle different backend claim names
      username =
        decoded.name ||
        decoded.unique_name ||
        decoded.email ||
        "User";
    }
  } catch (err) {
    console.error("Invalid token");
  }

  // 📌 Menu Items
  const menu = [
    { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
    { label: "Employees", path: "/employees", icon: <PeopleIcon /> },
    { label: "Departments", path: "/departments", icon: <BusinessIcon /> }
  ];

  // 🔓 Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{
        background: "#ffffff",
        color: "#333",
        borderBottom: "1px solid #eee"
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>

        {/* 🔷 LEFT SIDE */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>

          {/* LOGO */}
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/dashboard")}
          >
            HR System
          </Typography>

          {/* MENU */}
          <Box sx={{ display: "flex", gap: 1 }}>
            {menu.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <Button
                  key={item.path}
                  startIcon={item.icon}
                  onClick={() => navigate(item.path)}
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    px: 2,
                    fontWeight: 500,
                    color: isActive ? "#1976d2" : "#555",
                    background: isActive ? "#e3f2fd" : "transparent",
                    "&:hover": {
                      background: "#f5f5f5"
                    }
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>
        </Box>

        {/* 🔷 RIGHT SIDE */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>

          {/* USER INFO */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar sx={{ bgcolor: "#1976d2" }}>
              {username.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="body2" fontWeight="500">
              {username}
            </Typography>
          </Box>

          {/* LOGOUT */}
          <IconButton
            onClick={handleLogout}
            sx={{
              color: "#555",
              "&:hover": {
                background: "#f5f5f5"
              }
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Box>

      </Toolbar>
    </AppBar>
  );
}