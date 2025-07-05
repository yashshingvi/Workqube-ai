import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const SettingsPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="body1" color="text.secondary">
          User Settings & System Configuration coming soon
        </Typography>
      </Paper>
    </Box>
  );
};

export default SettingsPage; 