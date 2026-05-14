import {
  Box, Button, Drawer, TextField, IconButton
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function CrudTable({
  title,
  columns,
  rows,
  setRows,
  formFields
}) {
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({});

  const handleSubmit = () => {
    if (isEdit) {
      setRows(rows.map((r) => (r.id === form.id ? form : r)));
    } else {
      setRows([...rows, { ...form, id: crypto.randomUUID() }]);
    }
    setOpen(false);
    setForm({});
    setIsEdit(false);
  };

  const handleEdit = (row) => {
    setForm(row);
    setIsEdit(true);
    setOpen(true);
  };

  const handleDelete = (id) => {
    setRows(rows.filter((r) => r.id !== id));
  };

  const filtered = rows.filter((r) =>
    Object.values(r).join(" ").toLowerCase().includes(search.toLowerCase())
  );

  const actionColumn = {
    field: "actions",
    headerName: "Actions",
    renderCell: (params) => (
      <>
        <IconButton onClick={() => handleEdit(params.row)}>
          <EditIcon color="primary" />
        </IconButton>
        <IconButton onClick={() => handleDelete(params.row.id)}>
          <DeleteIcon color="error" />
        </IconButton>
      </>
    )
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <h2>{title}</h2>
        <Button variant="contained" onClick={() => setOpen(true)}>
          + Add
        </Button>
      </Box>

      <TextField
        fullWidth
        placeholder="Search..."
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Box sx={{ height: 450, background: "#fff" }}>
        <DataGrid
          rows={filtered}
          columns={[...columns, actionColumn]}
          pageSize={5}
        />
      </Box>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 350, p: 3 }}>
          {formFields.map((field) => (
            <TextField
              key={field.name}
              label={field.label}
              value={form[field.name] || ""}
              onChange={(e) =>
                setForm({ ...form, [field.name]: e.target.value })
              }
              sx={{ mb: 2 }}
              fullWidth
            />
          ))}

          <Button variant="contained" onClick={handleSubmit}>
            {isEdit ? "Update" : "Add"}
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
}