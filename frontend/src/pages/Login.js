import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  CircularProgress
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  const login = async () => {
    setError("");

    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", { username, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      navigate("/dashboard");
    } catch {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") login();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(to bottom, #f8fafc, #eef2f7)"
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            width: 380,
            borderRadius: "20px",
            background: "rgba(255,255,255,0.65)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.3)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.1)"
          }}
        >
          <Box mb={3} textAlign="center">
            <Typography
              variant="h5"
              fontWeight="600"
              sx={{ letterSpacing: "-0.5px" }}
            >
              TechNova Solutions
            </Typography>

            <Typography color="text.secondary" fontSize={14}>
              Sign in to your account
            </Typography>
          </Box>

          {error && (
            <Typography
              color="error"
              fontSize={13}
              mb={1}
              textAlign="center"
            >
              {error}
            </Typography>
          )}

          <TextField
            fullWidth
            margin="normal"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyPress}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px"
              }
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyPress}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px"
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <motion.div whileHover={{ scale: 1.02 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={login}
              disabled={loading}
              sx={{
                mt: 2,
                py: 1.2,
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 600,
                background: "#111827",
                "&:hover": {
                  background: "#000"
                }
              }}
            >
              {loading ? (
                <CircularProgress size={22} sx={{ color: "#fff" }} />
              ) : (
                "Sign in"
              )}
            </Button>
          </motion.div>
        </Paper>
      </motion.div>
    </Box>
  );
}