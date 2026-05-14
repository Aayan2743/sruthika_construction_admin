import { useState } from "react";
import {
  Box, TextField, Button, Typography
} from "@mui/material";

export default function ManagerLogs({ project, setProjects }) {

  const [form, setForm] = useState({
    labourCount: "",
    machineryUsed: "",
    notes: ""
  });

  const submitLog = () => {
  if (!form.labourCount) return;

  const log = {
    ...form,
    date: new Date().toLocaleDateString(),
    id: Date.now()
  };

  setProjects(prev =>
    prev.map(p =>
      p.id === project.id
        ? { ...p, logs: [...(p.logs || []), log] }
        : p
    )
  );
};

  return (
    <Box>
      <Typography variant="h6">Daily Update</Typography>

      <TextField
        label="Labour Count"
        fullWidth
        margin="dense"
        value={form.labourCount}
        onChange={(e)=>setForm({...form,labourCount:e.target.value})}
      />

      <TextField
        label="Machinery Used"
        fullWidth
        margin="dense"
        value={form.machineryUsed}
        onChange={(e)=>setForm({...form,machineryUsed:e.target.value})}
      />

      <TextField
        label="Notes"
        fullWidth
        margin="dense"
        value={form.notes}
        onChange={(e)=>setForm({...form,notes:e.target.value})}
      />

      <Button sx={{ mt:2 }} variant="contained" onClick={submitLog}>
        Submit Daily Report
      </Button>
    </Box>
  );
}