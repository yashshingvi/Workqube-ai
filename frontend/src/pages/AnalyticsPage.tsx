import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const AnalyticsPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Analytics
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="body1" color="text.secondary">
          Analytics & Insights - Performance metrics and reporting coming soon
        </Typography>
      </Paper>
    </Box>
  );
};

export default AnalyticsPage; 