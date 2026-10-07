import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateReminderDto {
  @ApiProperty({ description: 'Identifiant du bijoutier ou client', example: 'usr_123456' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Email du destinataire', example: 'bijouterie@example.com', required: false })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'Numéro WhatsApp (ex: 772406874)', example: '772406874', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'Nom du client ou de la bijouterie', example: 'Bijouterie Sandaga Gold', required: false })
  @IsString()
  @IsOptional()
  clientName?: string;

  @ApiProperty({ description: 'Montant de renouvellement en FCFA', example: 11500, default: 11500 })
  @IsNumber()
  @Min(1000)
  @IsOptional()
  amount?: number = 11500;
}
