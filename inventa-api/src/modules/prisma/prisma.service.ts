import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Connexion à PostgreSQL établie avec succès.');
    } catch (error) {
      this.logger.warn('⚠️ Base de données PostgreSQL non joignable pour le moment (démarrera avec Docker).');
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Déconnexion de PostgreSQL effectuée.');
  }
}
