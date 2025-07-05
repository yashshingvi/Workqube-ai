import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const WorkflowBuilderPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Workflow Builder
      </Typography>
      <Paper sx={{ p: 2, height: 'calc(100vh - 200px)' }}>
        <Typography variant="body1" color="text.secondary">
          Visual Workflow Builder - Drag and drop interface coming soon
        </Typography>
      </Paper>
    </Box>
  );
};

export default WorkflowBuilderPage; 