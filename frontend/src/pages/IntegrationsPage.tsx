import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const IntegrationsPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Integrations
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="body1" color="text.secondary">
          Third-party Integrations - Connect to external services coming soon
        </Typography>
      </Paper>
    </Box>
  );
};

export default IntegrationsPage; 