import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class WaveWebhookDto {
  @ApiProperty({ description: 'Identifiant unique de l’événement Wave', example: 'evt_123456789' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Type d’événement Wave', example: 'checkout.session.completed' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'Données de la transaction Wave' })
  @IsObject()
  data: Record<string, any>;

  @ApiProperty({ description: 'Date de création de l’événement', required: false })
  @IsOptional()
  created_at?: string;
}
