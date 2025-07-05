import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Configuration interface
export interface PlatformConfig {
  ai: {
    openai: boolean;
    anthropic: boolean;
  };
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  integrations: {
    salesforce: boolean;
    hubspot: boolean;
    slack: boolean;
    teams: boolean;
    google: boolean;
  };
  features: {
    aiFeatures: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    salesforceIntegration: boolean;
    hubspotIntegration: boolean;
    slackIntegration: boolean;
    teamsIntegration: boolean;
    googleIntegration: boolean;
  };
}

// API for checking service availability
export const configApi = createApi({
  reducerPath: 'configApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/v1' }),
  endpoints: (builder) => ({
    getPlatformConfig: builder.query<PlatformConfig, void>({
      query: () => 'config/platform',
    }),
    checkServiceHealth: builder.query<{ [key: string]: boolean }, void>({
      query: () => 'config/health',
    }),
  }),
});

export const { useGetPlatformConfigQuery, useCheckServiceHealthQuery } = configApi;

// Configuration service class
export class ConfigService {
  private static instance: ConfigService;
  private config: PlatformConfig | null = null;
  private warnings: string[] = [];

  private constructor() {}

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  // Get platform configuration
  async getConfig(): Promise<PlatformConfig> {
    if (this.config) {
      return this.config;
    }

    try {
      const response = await fetch('/api/v1/config/platform');
      if (response.ok) {
        this.config = await response.json();
      } else {
        // Fallback to default config if API fails
        this.config = this.getDefaultConfig();
      }
    } catch (error) {
      console.warn('Failed to fetch platform config, using defaults:', error);
      this.config = this.getDefaultConfig();
    }

    return this.config;
  }

  // Get warnings for missing optional services
  getWarnings(): string[] {
    const warnings: string[] = [];

    if (!this.config) {
      return warnings;
    }

    // AI Service warnings
    if (!this.config.ai.openai && !this.config.ai.anthropic) {
      warnings.push('AI features are disabled. Add OpenAI or Anthropic API keys to enable AI-powered workflow suggestions.');
    }

    // Notification warnings
    if (!this.config.notifications.email) {
      warnings.push('Email notifications are disabled. Configure SMTP settings to enable email notifications.');
    }
    if (!this.config.notifications.sms) {
      warnings.push('SMS notifications are disabled. Add Twilio credentials to enable SMS notifications.');
    }
    if (!this.config.notifications.push) {
      warnings.push('Push notifications are disabled. Configure Firebase to enable push notifications.');
    }

    // Integration warnings
    if (!this.config.integrations.salesforce) {
      warnings.push('Salesforce integration is disabled. Add Salesforce credentials to enable CRM integration.');
    }
    if (!this.config.integrations.hubspot) {
      warnings.push('HubSpot integration is disabled. Add HubSpot API key to enable marketing automation.');
    }
    if (!this.config.integrations.slack) {
      warnings.push('Slack integration is disabled. Add Slack credentials to enable team collaboration.');
    }

    return warnings;
  }

  // Check if a specific feature is available
  isFeatureEnabled(feature: keyof PlatformConfig['features']): boolean {
    return this.config?.features[feature] || false;
  }

  // Get feature status for UI display
  getFeatureStatus(): { [key: string]: { enabled: boolean; message: string } } {
    return {
      aiFeatures: {
        enabled: this.isFeatureEnabled('aiFeatures'),
        message: this.isFeatureEnabled('aiFeatures') 
          ? 'AI features are enabled' 
          : 'Add OpenAI or Anthropic API keys to enable AI features'
      },
      emailNotifications: {
        enabled: this.isFeatureEnabled('emailNotifications'),
        message: this.isFeatureEnabled('emailNotifications')
          ? 'Email notifications are enabled'
          : 'Configure SMTP settings to enable email notifications'
      },
      smsNotifications: {
        enabled: this.isFeatureEnabled('smsNotifications'),
        message: this.isFeatureEnabled('smsNotifications')
          ? 'SMS notifications are enabled'
          : 'Add Twilio credentials to enable SMS notifications'
      },
      pushNotifications: {
        enabled: this.isFeatureEnabled('pushNotifications'),
        message: this.isFeatureEnabled('pushNotifications')
          ? 'Push notifications are enabled'
          : 'Configure Firebase to enable push notifications'
      },
      salesforceIntegration: {
        enabled: this.isFeatureEnabled('salesforceIntegration'),
        message: this.isFeatureEnabled('salesforceIntegration')
          ? 'Salesforce integration is enabled'
          : 'Add Salesforce credentials to enable CRM integration'
      },
      hubspotIntegration: {
        enabled: this.isFeatureEnabled('hubspotIntegration'),
        message: this.isFeatureEnabled('hubspotIntegration')
          ? 'HubSpot integration is enabled'
          : 'Add HubSpot API key to enable marketing automation'
      },
      slackIntegration: {
        enabled: this.isFeatureEnabled('slackIntegration'),
        message: this.isFeatureEnabled('slackIntegration')
          ? 'Slack integration is enabled'
          : 'Add Slack credentials to enable team collaboration'
      }
    };
  }

  // Default configuration when API is not available
  private getDefaultConfig(): PlatformConfig {
    return {
      ai: {
        openai: false,
        anthropic: false,
      },
      notifications: {
        email: false,
        sms: false,
        push: false,
      },
      integrations: {
        salesforce: false,
        hubspot: false,
        slack: false,
        teams: false,
        google: false,
      },
      features: {
        aiFeatures: false,
        emailNotifications: false,
        smsNotifications: false,
        pushNotifications: false,
        salesforceIntegration: false,
        hubspotIntegration: false,
        slackIntegration: false,
        teamsIntegration: false,
        googleIntegration: false,
      },
    };
  }
}

export default ConfigService; 