import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

@ApiTags('Santé & Système')
@Controller('health')
export class HealthController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  @ApiOperation({ summary: 'Vérification de santé de l’API Inventa' })
  @ApiResponse({ status: 200, description: 'L’API fonctionne correctement' })
  checkHealth() {
    return {
      status: 'ok',
      service: 'inventa-api',
      version: '1.0.0',
      environment: this.configService.get<string>('nodeEnv'),
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  }
}
