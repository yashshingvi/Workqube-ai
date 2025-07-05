import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const WorkflowsPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Workflows
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="body1" color="text.secondary">
          Workflow Management - List and manage workflows coming soon
        </Typography>
      </Paper>
    </Box>
  );
};

export default WorkflowsPage; 