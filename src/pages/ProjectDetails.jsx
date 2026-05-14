import {
  Box, Typography, Grid, Card, CardContent, Chip
} from "@mui/material";

export default function ProjectDetail({ project }) {
  if (!project) return null;

  return (
    <Box>

      {/* HEADER */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">{project.name}</Typography>

        <Chip
          label={project.status || "Active"}
          color={project.status === "Completed" ? "default" : "success"}
          sx={{ mt: 1 }}
        />
      </Box>

      {/* STATS */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Card><CardContent>
            <Typography>Manager</Typography>
            <Typography variant="h6">{project.manager}</Typography>
          </CardContent></Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card><CardContent>
            <Typography>Machinery</Typography>
            <Typography variant="h6">{project.machinery?.length || 0}</Typography>
          </CardContent></Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card><CardContent>
            <Typography>Vendors</Typography>
            <Typography variant="h6">{project.vendors?.length || 0}</Typography>
          </CardContent></Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card><CardContent>
            <Typography>Logs</Typography>
            <Typography variant="h6">{project.logs?.length || 0}</Typography>
          </CardContent></Card>
        </Grid>
      </Grid>

      {/* LOGS */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Recent Activity</Typography>

        {(project.logs || []).map(log => (
          <Card key={log.id} sx={{ mt: 2 }}>
            <CardContent>
              <Typography fontWeight="bold">{log.date}</Typography>
              <Typography>Labours: {log.labourCount}</Typography>
              <Typography>Machinery: {log.machineryUsed}</Typography>
              <Typography color="text.secondary">{log.notes}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

    </Box>
  );
}