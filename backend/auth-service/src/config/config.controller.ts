import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConfigService } from './config.service';

@ApiTags('configuration')
@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get('platform')
  @ApiOperation({ summary: 'Get platform configuration' })
  @ApiResponse({ 
    status: 200, 
    description: 'Platform configuration retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        ai: {
          type: 'object',
          properties: {
            openai: { type: 'boolean' },
            anthropic: { type: 'boolean' },
          },
        },
        notifications: {
          type: 'object',
          properties: {
            email: { type: 'boolean' },
            sms: { type: 'boolean' },
            push: { type: 'boolean' },
          },
        },
        integrations: {
          type: 'object',
          properties: {
            salesforce: { type: 'boolean' },
            hubspot: { type: 'boolean' },
            slack: { type: 'boolean' },
            teams: { type: 'boolean' },
            google: { type: 'boolean' },
          },
        },
        features: {
          type: 'object',
          properties: {
            aiFeatures: { type: 'boolean' },
            emailNotifications: { type: 'boolean' },
            smsNotifications: { type: 'boolean' },
            pushNotifications: { type: 'boolean' },
            salesforceIntegration: { type: 'boolean' },
            hubspotIntegration: { type: 'boolean' },
            slackIntegration: { type: 'boolean' },
            teamsIntegration: { type: 'boolean' },
            googleIntegration: { type: 'boolean' },
          },
        },
      },
    },
  })
  getPlatformConfig() {
    return this.configService.getPlatformConfig();
  }

  @Get('health')
  @ApiOperation({ summary: 'Check service health and configuration status' })
  @ApiResponse({ 
    status: 200, 
    description: 'Service health status',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        timestamp: { type: 'string' },
        version: { type: 'string' },
        environment: { type: 'string' },
        services: {
          type: 'object',
          properties: {
            database: { type: 'boolean' },
            redis: { type: 'boolean' },
            email: { type: 'boolean' },
            sms: { type: 'boolean' },
            push: { type: 'boolean' },
            salesforce: { type: 'boolean' },
            hubspot: { type: 'boolean' },
            slack: { type: 'boolean' },
          },
        },
        warnings: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
  })
  getHealth() {
    const warnings = this.configService.getConfigurationWarnings();
    
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: this.configService.nodeEnv,
      services: {
        database: true, // Assuming database is always available
        redis: true, // Assuming Redis is always available
        email: this.configService.enableEmailNotifications,
        sms: this.configService.enableSmsNotifications,
        push: this.configService.enablePushNotifications,
        salesforce: this.configService.isSalesforceConfigured(),
        hubspot: this.configService.isHubspotConfigured(),
        slack: this.configService.isSlackConfigured(),
      },
      warnings,
    };
  }

  @Get('warnings')
  @ApiOperation({ summary: 'Get configuration warnings' })
  @ApiResponse({ 
    status: 200, 
    description: 'Configuration warnings retrieved',
    schema: {
      type: 'object',
      properties: {
        warnings: {
          type: 'array',
          items: { type: 'string' },
        },
        count: { type: 'number' },
      },
    },
  })
  getWarnings() {
    const warnings = this.configService.getConfigurationWarnings();
    
    return {
      warnings,
      count: warnings.length,
    };
  }
} 