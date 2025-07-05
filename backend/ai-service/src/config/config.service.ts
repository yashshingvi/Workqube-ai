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
    return this.configService.get<number>('PORT', 3004);
  }

  get redisUrl(): string {
    return this.configService.get<string>('REDIS_URL', 'redis://redis:6379');
  }

  // AI API Keys (Optional)
  get openaiApiKey(): string | undefined {
    return this.configService.get<string>('OPENAI_API_KEY');
  }

  get anthropicApiKey(): string | undefined {
    return this.configService.get<string>('ANTHROPIC_API_KEY');
  }

  // Check if AI services are configured
  isOpenAIConfigured(): boolean {
    return !!this.openaiApiKey;
  }

  isAnthropicConfigured(): boolean {
    return !!this.anthropicApiKey;
  }

  isAnyAIConfigured(): boolean {
    return this.isOpenAIConfigured() || this.isAnthropicConfigured();
  }

  // Get configuration warnings
  getConfigurationWarnings(): string[] {
    const warnings: string[] = [];

    if (!this.isOpenAIConfigured()) {
      warnings.push('OpenAI API key is not configured. Add OPENAI_API_KEY to enable GPT-4 features.');
    }

    if (!this.isAnthropicConfigured()) {
      warnings.push('Anthropic API key is not configured. Add ANTHROPIC_API_KEY to enable Claude features.');
    }

    if (!this.isAnyAIConfigured()) {
      warnings.push('No AI services are configured. AI features will be disabled.');
    }

    return warnings;
  }

  // Get platform configuration for frontend
  getPlatformConfig() {
    return {
      ai: {
        openai: this.isOpenAIConfigured(),
        anthropic: this.isAnthropicConfigured(),
      },
      notifications: {
        email: false, // Handled by notification service
        sms: false, // Handled by notification service
        push: false, // Handled by notification service
      },
      integrations: {
        salesforce: false, // Handled by integration service
        hubspot: false, // Handled by integration service
        slack: false, // Handled by integration service
        teams: false,
        google: false,
      },
      features: {
        aiFeatures: this.isAnyAIConfigured(),
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

  // Get AI service status
  getAIServiceStatus() {
    return {
      openai: {
        configured: this.isOpenAIConfigured(),
        message: this.isOpenAIConfigured() 
          ? 'OpenAI GPT-4 is available' 
          : 'Add OPENAI_API_KEY to enable GPT-4 features'
      },
      anthropic: {
        configured: this.isAnthropicConfigured(),
        message: this.isAnthropicConfigured()
          ? 'Anthropic Claude is available'
          : 'Add ANTHROPIC_API_KEY to enable Claude features'
      },
      overall: {
        available: this.isAnyAIConfigured(),
        message: this.isAnyAIConfigured()
          ? 'AI features are enabled'
          : 'No AI services are configured. Add OpenAI or Anthropic API keys.'
      }
    };
  }
} 