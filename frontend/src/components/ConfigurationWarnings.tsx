import React, { useEffect, useState } from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  ExpandMore as ExpandMoreIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Hub as IntegrationIcon,
  SmartToy as AIIcon,
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { addNotification } from '../store/slices/uiSlice';
import ConfigService, { PlatformConfig } from '../services/configService';

interface ConfigurationWarningsProps {
  showAsNotifications?: boolean;
  showAsCard?: boolean;
}

const ConfigurationWarnings: React.FC<ConfigurationWarningsProps> = ({
  showAsNotifications = true,
  showAsCard = false,
}) => {
  const [config, setConfig] = useState<PlatformConfig | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [featureStatus, setFeatureStatus] = useState<{ [key: string]: { enabled: boolean; message: string } }>({});
  const dispatch = useDispatch();

  useEffect(() => {
    const loadConfig = async () => {
      const configService = ConfigService.getInstance();
      const platformConfig = await configService.getConfig();
      setConfig(platformConfig);
      setWarnings(configService.getWarnings());
      setFeatureStatus(configService.getFeatureStatus());

      // Show notifications for missing configurations
      if (showAsNotifications && warnings.length > 0) {
        warnings.forEach((warning) => {
          dispatch(
            addNotification({
              id: `config-warning-${Date.now()}-${Math.random()}`,
              type: 'warning',
              message: warning,
              duration: 10000,
            })
          );
        });
      }
    };

    loadConfig();
  }, [dispatch, showAsNotifications, warnings.length]);

  if (!config || warnings.length === 0) {
    return null;
  }

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case 'aiFeatures':
        return <AIIcon />;
      case 'emailNotifications':
      case 'smsNotifications':
      case 'pushNotifications':
        return <NotificationsIcon />;
      case 'salesforceIntegration':
      case 'hubspotIntegration':
      case 'slackIntegration':
        return <IntegrationIcon />;
      default:
        return <SettingsIcon />;
    }
  };

  const getFeatureColor = (enabled: boolean) => {
    return enabled ? 'success' : 'warning';
  };

  if (showAsCard) {
    return (
      <Card sx={{ mb: 2, border: '1px solid #ff9800' }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <WarningIcon color="warning" sx={{ mr: 1 }} />
            <Typography variant="h6" color="warning.main">
              Configuration Warnings
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" mb={2}>
            Some optional features are disabled due to missing configuration. The platform will work without these features.
          </Typography>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Feature Status</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {Object.entries(featureStatus).map(([feature, status]) => (
                  <Grid item xs={12} sm={6} md={4} key={feature}>
                    <Box display="flex" alignItems="center" p={1}>
                      {getFeatureIcon(feature)}
                      <Box ml={1} flex={1}>
                        <Typography variant="body2" fontWeight="medium">
                          {feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </Typography>
                        <Chip
                          size="small"
                          color={getFeatureColor(status.enabled)}
                          label={status.enabled ? 'Enabled' : 'Disabled'}
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Configuration Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List dense>
                {warnings.map((warning, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <WarningIcon color="warning" />
                    </ListItemIcon>
                    <ListItemText primary={warning} />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        </CardContent>
      </Card>
    );
  }

  return (
    <Alert severity="warning" sx={{ mb: 2 }}>
      <AlertTitle>Configuration Warnings</AlertTitle>
      <Typography variant="body2" mb={1}>
        Some optional features are disabled. The platform will work without these features.
      </Typography>
      <Box mt={1}>
        {warnings.slice(0, 3).map((warning, index) => (
          <Typography key={index} variant="body2" color="text.secondary">
            • {warning}
          </Typography>
        ))}
        {warnings.length > 3 && (
          <Typography variant="body2" color="text.secondary">
            • ... and {warnings.length - 3} more warnings
          </Typography>
        )}
      </Box>
    </Alert>
  );
};

export default ConfigurationWarnings; 