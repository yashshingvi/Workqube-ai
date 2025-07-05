import { Controller, Post, Body, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConfigService } from './config/config.service';

interface AIGenerateRequest {
  prompt: string;
  model?: 'gpt-4' | 'claude-3';
  maxTokens?: number;
}

interface AIGenerateResponse {
  text: string;
  model: string;
  tokensUsed: number;
}

@ApiTags('ai')
@Controller('ai')
export class AIController {
  constructor(private readonly configService: ConfigService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate text using AI' })
  @ApiResponse({ 
    status: 200, 
    description: 'Text generated successfully',
    schema: {
      type: 'object',
      properties: {
        text: { type: 'string' },
        model: { type: 'string' },
        tokensUsed: { type: 'number' },
      },
    },
  })
  @ApiResponse({ 
    status: 503, 
    description: 'No AI services configured' 
  })
  async generateText(@Body() request: AIGenerateRequest): Promise<AIGenerateResponse> {
    const { prompt, model = 'gpt-4', maxTokens = 1000 } = request;

    // Check if any AI service is configured
    if (!this.configService.isAnyAIConfigured()) {
      throw new HttpException(
        {
          error: 'No AI services configured',
          message: 'Please configure OpenAI or Anthropic API keys to use AI features',
          warnings: this.configService.getConfigurationWarnings(),
        },
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }

    // Try to use the requested model
    if (model === 'gpt-4' && this.configService.isOpenAIConfigured()) {
      // Simulate OpenAI API call
      return {
        text: `[OpenAI GPT-4 Response] ${prompt}`,
        model: 'gpt-4',
        tokensUsed: Math.ceil(prompt.length / 4),
      };
    } else if (model === 'claude-3' && this.configService.isAnthropicConfigured()) {
      // Simulate Anthropic API call
      return {
        text: `[Anthropic Claude Response] ${prompt}`,
        model: 'claude-3',
        tokensUsed: Math.ceil(prompt.length / 4),
      };
    } else {
      // Fallback to available service
      if (this.configService.isOpenAIConfigured()) {
        return {
          text: `[OpenAI GPT-4 Response] ${prompt}`,
          model: 'gpt-4',
          tokensUsed: Math.ceil(prompt.length / 4),
        };
      } else if (this.configService.isAnthropicConfigured()) {
        return {
          text: `[Anthropic Claude Response] ${prompt}`,
          model: 'claude-3',
          tokensUsed: Math.ceil(prompt.length / 4),
        };
      }
    }

    throw new HttpException(
      {
        error: 'No suitable AI model available',
        message: 'The requested model is not configured',
      },
      HttpStatus.BAD_REQUEST
    );
  }

  @Get('config')
  @ApiOperation({ summary: 'Get AI service configuration status' })
  @ApiResponse({ 
    status: 200, 
    description: 'Configuration status retrieved',
    schema: {
      type: 'object',
      properties: {
        openai: {
          type: 'object',
          properties: {
            configured: { type: 'boolean' },
            message: { type: 'string' },
          },
        },
        anthropic: {
          type: 'object',
          properties: {
            configured: { type: 'boolean' },
            message: { type: 'string' },
          },
        },
        overall: {
          type: 'object',
          properties: {
            available: { type: 'boolean' },
            message: { type: 'string' },
          },
        },
      },
    },
  })
  getConfig() {
    return this.configService.getAIServiceStatus();
  }

  @Get('health')
  @ApiOperation({ summary: 'Check AI service health' })
  @ApiResponse({ 
    status: 200, 
    description: 'Service health status',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        timestamp: { type: 'string' },
        services: {
          type: 'object',
          properties: {
            openai: { type: 'boolean' },
            anthropic: { type: 'boolean' },
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
      status: this.configService.isAnyAIConfigured() ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      services: {
        openai: this.configService.isOpenAIConfigured(),
        anthropic: this.configService.isAnthropicConfigured(),
      },
      warnings,
    };
  }

  @Get('platform-config')
  @ApiOperation({ summary: 'Get platform configuration for frontend' })
  getPlatformConfig() {
    return this.configService.getPlatformConfig();
  }
} 