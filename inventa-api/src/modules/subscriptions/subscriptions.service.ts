import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReminderDto } from './dto/create-reminder.dto';

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly notificationsService: NotificationsService,
    private readonly prisma: PrismaService,
  ) {}

  buildWaveMerchantUrl(amount = 11500): string {
    const rawBase = this.configService.get<string>('wave.merchantBaseUrl');
    const baseUrl = rawBase.replace(/\/?$/, '');
    return `${baseUrl}/?amount=${Math.round(amount)}`;
  }

  async sendReminder(dto: CreateReminderDto) {
    const amount = dto.amount || 11500;
    const waveUrl = this.buildWaveMerchantUrl(amount);

    this.logger.log(`Traitement du rappel pour l'utilisateur ${dto.userId} (${amount} FCFA)`);

    // Envoi par email si adresse fournie
    if (dto.email) {
      await this.notificationsService.sendEmail({
        to: dto.email,
        subject: `Renouvellement de votre compte Inventa · ${dto.clientName || 'Bijouterie'}`,
        idempotencyKey: `remind-${dto.userId}-${Date.now()}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #e2e8f0;border-radius:12px">
            <h2 style="color:#0A1628">Renouvellement de votre abonnement Inventa</h2>
            <p>Bonjour ${dto.clientName || ''},</p>
            <p>Votre abonnement pour votre bijouterie arrive à échéance.</p>
            <p>Montant à régler : <strong>${amount.toLocaleString('fr-FR')} FCFA</strong></p>
            <p style="margin:24px 0">
              <a href="${waveUrl}" style="background-color:#1DA1F2;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:bold;display:inline-block">
                Payer avec Wave (${amount.toLocaleString('fr-FR')} FCFA)
              </a>
            </p>
            <p style="font-size:12px;color:#64748B">Bayecode Tech · Support client : +221 77 240 68 74</p>
          </div>
        `,
      });
    }

    return {
      success: true,
      userId: dto.userId,
      amount,
      waveUrl,
      sentAt: new Date().toISOString(),
    };
  }

  // Tâche programmée : s'exécute automatiquement chaque matin à 8h00
  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async handleDailyExpiryCheck() {
    this.logger.log('⏰ Exécution du contrôle quotidien des abonnements arrivant à échéance...');
    // Exemple : scanner les abonnements dont expiresAt <= now() + 5 jours
  }
}
