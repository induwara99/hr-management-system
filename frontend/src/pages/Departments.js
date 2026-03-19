import React, { useEffect, useState } from "react";
import API from "../api/api";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";

import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Box,
  Chip,
  Skeleton
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { motion } from "framer-motion";

export default function Departments() {

  const role = localStorage.getItem("role");
  const canCreate = role === "Admin" || role === "HR";
  const canEdit = role === "Admin" || role === "HR";
  const canDelete = role === "Admin";

  const [data, setData] = useState([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    id: 0,
    departmentCode: "",
    departmentName: ""
  });

  const load = async () => {
    try {
      const res = await API.get("/department");
      setData(res.data || []);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!form.departmentCode || !form.departmentName)
      return toast.error("All fields required");

    const payload = {
      id: form.id,
      DepartmentCode: form.departmentCode,
      DepartmentName: form.departmentName
    };

    try {
      if (editing) {
        await API.put("/department", payload);
        toast.success("Updated");
      } else {
        await API.post("/department", payload);
        toast.success("Added");
      }
      reset();
      load();
    } catch {
      toast.error("Error");
    }
  };

  const edit = (d) => {
    setForm(d);
    setEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete department?")) return;
    await API.delete(`/department/${id}`);
    toast.success("Deleted");
    load();
  };

  const reset = () => {
    setForm({
      id: 0,
      departmentCode: "",
      departmentName: ""
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
              Department Management
            </Typography>
            <Typography color="text.secondary">
              Manage organizational structure and departments
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
            {editing ? "Edit Department" : "Add Department"}
          </Typography>

          <Grid container spacing={3}>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Department Code"
                disabled={!canCreate}
                value={form.departmentCode}
                onChange={(e) =>
                  setForm({ ...form, departmentCode: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Department Name"
                disabled={!canCreate}
                value={form.departmentName}
                onChange={(e) =>
                  setForm({ ...form, departmentName: e.target.value })
                }
              />
            </Grid>

          </Grid>

          <Box mt={4} display="flex" justifyContent="space-between" alignItems="center">

            <Chip label={`Role: ${role}`} />

            <Box display="flex" gap={2}>
              {editing && (
                <Button variant="outlined" size="large" onClick={reset}>
                  Cancel
                </Button>
              )}

              {canCreate && (
                <Button variant="contained" size="large" onClick={save}>
                  {editing ? "Update Department" : "Add Department"}
                </Button>
              )}
            </Box>

          </Box>
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
              Departments
            </Typography>
            <Chip label={`Total: ${data.length}`} color="primary" />
          </Box>

          {loading ? (
            <Skeleton height={200} />
          ) : (
            <Grid container spacing={2}>
              {data.map((d) => (
                <Grid item xs={12} md={4} key={d.id}>
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
                        {d.departmentName}
                      </Typography>

                      <Typography color="text.secondary" mb={1}>
                        {d.departmentCode}
                      </Typography>

                      <Box display="flex" justifyContent="flex-end">
                        {canEdit && (
                          <IconButton onClick={() => edit(d)}>
                            <EditIcon />
                          </IconButton>
                        )}

                        {canDelete && (
                          <IconButton onClick={() => remove(d.id)}>
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