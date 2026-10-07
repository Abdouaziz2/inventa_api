import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WaveWebhookDto } from './dto/wave-webhook.dto';
import { PaymentsService } from './payments.service';

@ApiTags('Paiements & Webhooks')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('webhook/wave')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook officiel Wave Business pour la validation des paiements' })
  @ApiResponse({ status: 200, description: 'Événement traité' })
  handleWaveWebhook(@Body() payload: WaveWebhookDto) {
    return this.paymentsService.processWaveWebhook(payload);
  }
}
