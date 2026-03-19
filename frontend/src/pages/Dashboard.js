import React, { useEffect, useState } from "react";
import API from "../api/api";
import Navbar from "../components/Navbar";

import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  Skeleton
} from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from "recharts";

import { motion } from "framer-motion";

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const emp = await API.get("/employee");
      const dep = await API.get("/department");
      setEmployees(emp.data || []);
      setDepartments(dep.data || []);
    } catch (e) {
      setEmployees([]);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const dayName = new Date().toLocaleDateString("en-US", {
    weekday: "long"
  });

  const chartData = departments.map((d) => {
    const count = employees.filter(
      (e) => e.departmentId === d.id
    ).length;

    return {
      name: d.departmentName,
      employees: count
    };
  });

  const sortedData = [...chartData].sort(
    (a, b) => b.employees - a.employees
  );

  const totalEmployees = employees.length || 1;

  const COLORS = [
    "#5b8def",
    "#36cfc9",
    "#ff9f43",
    "#ff6b6b",
    "#9b59b6",
    "#2ecc71"
  ];

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg,#eef2f7,#f9fbfd)",
        minHeight: "100vh"
      }}
    >
      <Navbar />

      <Container maxWidth="xl" sx={{ mt: 4 }}>

        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}>
          <Box mb={5}>
            <Typography variant="h4" fontWeight="bold">
              HR Dashboard
            </Typography>
            <Typography color="text.secondary">
              Workforce overview — {dayName}
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={3}>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: 4,
                backdropFilter: "blur(10px)",
                background: "rgba(255,255,255,0.8)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
              }}
            >
              <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <Typography color="text.secondary">
                    Total Employees
                  </Typography>
                  {loading ? (
                    <Skeleton width={80} height={40} />
                  ) : (
                    <Typography variant="h4" fontWeight="bold">
                      {employees.length}
                    </Typography>
                  )}
                </Box>
                <PeopleIcon sx={{ fontSize: 50, color: "#5b8def" }} />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: 4,
                backdropFilter: "blur(10px)",
                background: "rgba(255,255,255,0.8)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
              }}
            >
              <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <Typography color="text.secondary">
                    Total Departments
                  </Typography>
                  {loading ? (
                    <Skeleton width={80} height={40} />
                  ) : (
                    <Typography variant="h4" fontWeight="bold">
                      {departments.length}
                    </Typography>
                  )}
                </Box>
                <BusinessIcon sx={{ fontSize: 50, color: "#36cfc9" }} />
              </CardContent>
            </Card>
          </Grid>

        </Grid>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
          <Card
            sx={{
              mt: 5,
              p: 4,
              borderRadius: 4,
              background: "#fff",
              boxShadow: "0 10px 40px rgba(0,0,0,0.06)"
            }}
          >
            <Box display="flex" justifyContent="space-between" mb={3}>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  Employees by Department
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Workforce distribution overview
                </Typography>
              </Box>

              <Chip
                label={`Total: ${employees.length}`}
                color="primary"
                sx={{ fontWeight: "bold" }}
              />
            </Box>

            {loading ? (
              <Skeleton variant="rectangular" height={300} />
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={sortedData}
                  margin={{ top: 20, right: 20, left: 0, bottom: 50 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />

                  <XAxis
                    dataKey="name"
                    angle={-15}
                    textAnchor="end"
                    interval={0}
                    tick={{ fontSize: 12 }}
                  />

                  <YAxis allowDecimals={false} />

                  <Tooltip
                    contentStyle={{
                      borderRadius: 10,
                      border: "none",
                      boxShadow: "0 5px 20px rgba(0,0,0,0.1)"
                    }}
                    formatter={(value) => {
                      const percent = ((value / totalEmployees) * 100).toFixed(1);
                      return [`${value} (${percent}%)`, "Employees"];
                    }}
                  />

                  <Bar
                    dataKey="employees"
                    radius={[10, 10, 0, 0]}
                    barSize={45}
                    animationDuration={800}
                  >
                    {sortedData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </motion.div>

      </Container>
    </Box>
  );
}