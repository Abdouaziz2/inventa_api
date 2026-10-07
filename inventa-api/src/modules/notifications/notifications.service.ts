import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  idempotencyKey?: string;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('smtp.host');
    const port = this.configService.get<number>('smtp.port');
    const user = this.configService.get<string>('smtp.user');
    const pass = this.configService.get<string>('smtp.pass');

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
      this.logger.log('📧 Service Email initialisé avec succès.');
    } else {
      this.logger.warn('📧 SMTP non configuré (les emails seront simulés en console).');
    }
  }

  async sendEmail(options: SendEmailOptions): Promise<boolean> {
    const from = this.configService.get<string>('smtp.from') || 'inventa@bayecode.com';
    const cleanId = options.idempotencyKey?.replace(/[^a-zA-Z0-9_-]/g, '') || `${Date.now()}`;
    const messageId = `<${cleanId}@bayecode.com>`;

    if (!this.transporter) {
      this.logger.log(`[SIMULATION EMAIL] Vers: ${options.to} | Objet: ${options.subject}`);
      return true;
    }

    try {
      await this.transporter.sendMail({
        from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        messageId,
        headers: {
          'X-Inventa-Message-ID': cleanId,
          'Auto-Submitted': 'auto-generated',
          'X-Auto-Response-Suppress': 'All',
        },
      });
      this.logger.log(`✅ Email envoyé avec succès à ${options.to}`);
      return true;
    } catch (error) {
      this.logger.error(`❌ Échec d'envoi d'email à ${options.to}:`, error);
      return false;
    }
  }
}
