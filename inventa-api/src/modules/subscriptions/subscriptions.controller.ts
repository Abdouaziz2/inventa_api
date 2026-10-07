import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { WaveUrlQueryDto } from './dto/wave-url-query.dto';
import { SubscriptionsService } from './subscriptions.service';

@ApiTags('Abonnements & Relances')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('wave-url')
  @ApiOperation({ summary: 'Générer un lien marchand direct Wave pour un montant' })
  @ApiResponse({ status: 200, description: 'Lien Wave généré avec succès' })
  getWaveUrl(@Query() query: WaveUrlQueryDto) {
    const amount = query.amount || 11500;
    const waveUrl = this.subscriptionsService.buildWaveMerchantUrl(amount);

    return {
      amount,
      currency: 'XOF',
      merchantName: 'Bayecode Tech',
      paymentUrl: waveUrl,
    };
  }

  @Post('reminder')
  @ApiOperation({ summary: 'Déclencher une relance de paiement (Email / WhatsApp)' })
  @ApiResponse({ status: 201, description: 'Rappel traité avec succès' })
  sendReminder(@Body() dto: CreateReminderDto) {
    return this.subscriptionsService.sendReminder(dto);
  }
}
