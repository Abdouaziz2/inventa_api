import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WaveWebhookDto } from './dto/wave-webhook.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async processWaveWebhook(payload: WaveWebhookDto) {
    this.logger.log(`[Wave Webhook] Traitement de l'événement ${payload.type} (ID: ${payload.id})`);

    // Exemple de traitement : quand le paiement Wave est validé
    if (payload.type === 'checkout.session.completed') {
      const clientReference = payload.data?.client_reference;
      const amount = payload.data?.amount;

      this.logger.log(`Paiement reçu avec succès : ${amount} FCFA pour la référence ${clientReference}`);

      // Ici, prolongation automatique de 30 jours de l'abonnement dans PostgreSQL
    }

    return { received: true, eventId: payload.id };
  }
}
