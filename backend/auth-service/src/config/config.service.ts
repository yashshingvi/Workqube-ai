import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService) {}

  // Core configuration
  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV', 'development');
  }

  get port(): number {
    return this.configService.get<number>('PORT', 3001);
  }

  // Database configuration
  get databaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL', 'postgresql://postgres:password@postgres:5432/auth_service');
  }

  get redisUrl(): string {
    return this.configService.get<string>('REDIS_URL', 'redis://redis:6379');
  }

  // JWT configuration
  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET', 'your-super-secret-jwt-key-change-in-production');
  }

  get jwtExpiresIn(): string {
    return this.configService.get<string>('JWT_EXPIRES_IN', '24h');
  }

  get refreshTokenSecret(): string {
    return this.configService.get<string>('REFRESH_TOKEN_SECRET', 'your-super-secret-refresh-token-key');
  }

  get refreshTokenExpiresIn(): string {
    return this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN', '7d');
  }

  // Rate limiting
  get rateLimitTtl(): number {
    return this.configService.get<number>('RATE_LIMIT_TTL', 60);
  }

  get rateLimitLimit(): number {
    return this.configService.get<number>('RATE_LIMIT_LIMIT', 100);
  }

  // CORS configuration
  get corsOrigin(): string {
    return this.configService.get<string>('CORS_ORIGIN', 'http://localhost:3000');
  }

  get corsCredentials(): boolean {
    return this.configService.get<boolean>('CORS_CREDENTIALS', true);
  }

  // Feature flags
  get enableEmailNotifications(): boolean {
    return this.configService.get<boolean>('ENABLE_EMAIL_NOTIFICATIONS', false);
  }

  get enableSmsNotifications(): boolean {
    return this.configService.get<boolean>('ENABLE_SMS_NOTIFICATIONS', false);
  }

  get enablePushNotifications(): boolean {
    return this.configService.get<boolean>('ENABLE_PUSH_NOTIFICATIONS', false);
  }

  // Optional integrations
  get salesforceClientId(): string | undefined {
    return this.configService.get<string>('SALESFORCE_CLIENT_ID');
  }

  get salesforceClientSecret(): string | undefined {
    return this.configService.get<string>('SALESFORCE_CLIENT_SECRET');
  }

  get hubspotApiKey(): string | undefined {
    return this.configService.get<string>('HUBSPOT_API_KEY');
  }

  get slackBotToken(): string | undefined {
    return this.configService.get<string>('SLACK_BOT_TOKEN');
  }

  // Check if integrations are configured
  isSalesforceConfigured(): boolean {
    return !!(this.salesforceClientId && this.salesforceClientSecret);
  }

  isHubspotConfigured(): boolean {
    return !!this.hubspotApiKey;
  }

  isSlackConfigured(): boolean {
    return !!this.slackBotToken;
  }

  // Get configuration warnings
  getConfigurationWarnings(): string[] {
    const warnings: string[] = [];

    if (!this.enableEmailNotifications) {
      warnings.push('Email notifications are disabled. Set ENABLE_EMAIL_NOTIFICATIONS=true and configure SMTP settings.');
    }

    if (!this.enableSmsNotifications) {
      warnings.push('SMS notifications are disabled. Set ENABLE_SMS_NOTIFICATIONS=true and configure Twilio settings.');
    }

    if (!this.enablePushNotifications) {
      warnings.push('Push notifications are disabled. Set ENABLE_PUSH_NOTIFICATIONS=true and configure Firebase settings.');
    }

    if (!this.isSalesforceConfigured()) {
      warnings.push('Salesforce integration is disabled. Add SALESFORCE_CLIENT_ID and SALESFORCE_CLIENT_SECRET to enable.');
    }

    if (!this.isHubspotConfigured()) {
      warnings.push('HubSpot integration is disabled. Add HUBSPOT_API_KEY to enable.');
    }

    if (!this.isSlackConfigured()) {
      warnings.push('Slack integration is disabled. Add SLACK_BOT_TOKEN to enable.');
    }

    return warnings;
  }

  // Get platform configuration for frontend
  getPlatformConfig() {
    return {
      ai: {
        openai: false, // AI service handles this
        anthropic: false, // AI service handles this
      },
      notifications: {
        email: this.enableEmailNotifications,
        sms: this.enableSmsNotifications,
        push: this.enablePushNotifications,
      },
      integrations: {
        salesforce: this.isSalesforceConfigured(),
        hubspot: this.isHubspotConfigured(),
        slack: this.isSlackConfigured(),
        teams: false, // Not implemented yet
        google: false, // Not implemented yet
      },
      features: {
        aiFeatures: false, // AI service handles this
        emailNotifications: this.enableEmailNotifications,
        smsNotifications: this.enableSmsNotifications,
        pushNotifications: this.enablePushNotifications,
        salesforceIntegration: this.isSalesforceConfigured(),
        hubspotIntegration: this.isHubspotConfigured(),
        slackIntegration: this.isSlackConfigured(),
        teamsIntegration: false,
        googleIntegration: false,
      },
    };
  }
} 