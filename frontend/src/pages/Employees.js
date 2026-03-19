import React, { useEffect, useState } from "react";
import API from "../api/api";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";

import {
  Container,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Chip,
  Skeleton
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { motion } from "framer-motion";

export default function Employees() {

  const role = localStorage.getItem("role");
  const canCreate = role === "Admin" || role === "HR";
  const canEdit = role === "Admin" || role === "HR";
  const canDelete = role === "Admin";

  const [data, setData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    id: 0,
    employeeCode: "",
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    salary: "",
    departmentId: ""
  });

  const load = async () => {
    try {
      const emp = await API.get("/employee");
      const dep = await API.get("/department");
      setData(emp.data || []);
      setDepartments(dep.data || []);
    } catch {
      setData([]);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const validate = () => {
    if (!form.employeeCode.trim()) return "Code required";
    if (!form.firstName.trim()) return "First name required";
    if (!form.departmentId) return "Select department";
    return null;
  };

  const save = async () => {
    const error = validate();
    if (error) return toast.error(error);

    const payload = {
      Id: form.id,
      EmployeeCode: form.employeeCode,
      FirstName: form.firstName,
      LastName: form.lastName,
      Email: form.email,
      DOB: form.dob || null,
      Salary: form.salary ? parseFloat(form.salary) : 0,
      DepartmentId: Number(form.departmentId)
    };

    try {
      if (editing) {
        await API.put("/employee", payload);
        toast.success("Employee Updated");
      } else {
        await API.post("/employee", payload);
        toast.success("Employee Added");
      }
      reset();
      load();
    } catch (err) {
      toast.error(err?.response?.data || "Error");
    }
  };

  const edit = (e) => {
    setForm({
      id: e.id,
      employeeCode: e.employeeCode,
      firstName: e.firstName,
      lastName: e.lastName,
      email: e.email,
      dob: e.dob?.split("T")[0] || "",
      salary: e.salary,
      departmentId: e.departmentId
    });
    setEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete employee?")) return;
    await API.delete(`/employee/${id}`);
    toast.success("Deleted");
    load();
  };

  const reset = () => {
    setForm({
      id: 0,
      employeeCode: "",
      firstName: "",
      lastName: "",
      email: "",
      dob: "",
      salary: "",
      departmentId: ""
    });
    setEditing(false);
  };

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
              Employee Management
            </Typography>
            <Typography color="text.secondary">
              Manage employees, roles and departments
            </Typography>
          </Box>
        </motion.div>

        <Card
          sx={{
            p: 4,
            mb: 5,
            borderRadius: 4,
            backdropFilter: "blur(10px)",
            background: "rgba(255,255,255,0.85)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.05)"
          }}
        >
          <Typography fontWeight="bold" mb={3}>
            {canCreate ? (editing ? "Edit Employee" : "Add Employee") : "Employee Details"}
          </Typography>

          <Grid container spacing={3}>

            <Grid item xs={12} md={2}>
              <TextField fullWidth label="Code" disabled={!canCreate}
                value={form.employeeCode}
                onChange={(e) => setForm({ ...form, employeeCode: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <TextField fullWidth label="First Name" disabled={!canCreate}
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <TextField fullWidth label="Last Name" disabled={!canCreate}
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField fullWidth label="Email" disabled={!canCreate}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  label="Department"
                  value={form.departmentId}
                  disabled={!canCreate}
                  onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
                >
                  {departments.map((d) => (
                    <MenuItem key={d.id} value={d.id}>
                      {d.departmentName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={2}>
              <TextField type="date" fullWidth disabled={!canCreate}
                InputLabelProps={{ shrink: true }}
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <TextField type="number" label="Salary" fullWidth disabled={!canCreate}
                value={form.salary}
                onChange={(e) => setForm({ ...form, salary: e.target.value })}
              />
            </Grid>

          </Grid>

          {canCreate && (
            <Box mt={4} display="flex" gap={2}>
              <Button variant="contained" size="large" onClick={save}>
                {editing ? "Update Employee" : "Add Employee"}
              </Button>

              {editing && (
                <Button variant="outlined" size="large" onClick={reset}>
                  Cancel
                </Button>
              )}
            </Box>
          )}
        </Card>

        <Card
          sx={{
            p: 3,
            borderRadius: 4,
            boxShadow: "0 10px 40px rgba(0,0,0,0.05)"
          }}
        >
          <Box display="flex" justifyContent="space-between" mb={3}>
            <Typography fontWeight="bold">
              Employees
            </Typography>
            <Chip label={`Total: ${data.length}`} color="primary" />
          </Box>

          {loading ? (
            <Skeleton height={200} />
          ) : (
            <Grid container spacing={2}>
              {data.map((e) => (
                <Grid item xs={12} md={4} key={e.id}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      transition: "0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
                      }
                    }}
                  >
                    <CardContent>
                      <Typography fontWeight="bold">
                        {e.firstName} {e.lastName}
                      </Typography>

                      <Typography color="text.secondary" mb={1}>
                        {e.email}
                      </Typography>

                      <Chip
                        label={e.departmentName}
                        size="small"
                        sx={{ mb: 1 }}
                      />

                      <Box display="flex" justifyContent="flex-end">
                        {canEdit && (
                          <IconButton onClick={() => edit(e)}>
                            <EditIcon />
                          </IconButton>
                        )}
                        {canDelete && (
                          <IconButton onClick={() => remove(e.id)}>
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Card>

      </Container>
    </Box>
  );
}