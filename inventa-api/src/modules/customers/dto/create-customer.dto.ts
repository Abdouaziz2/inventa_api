import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ description: 'Nom complet du client', example: 'Mme Fatou Diop' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ description: 'Numéro de téléphone / WhatsApp', example: '+221 77 123 45 67' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({ description: 'Adresse email', example: 'fatou.diop@gmail.com' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'Ville / Quartier', example: 'Dakar, Almadies', default: 'Dakar' })
  @IsString()
  @IsOptional()
  city?: string = 'Dakar';

  @ApiPropertyOptional({ description: 'Catégorie de client (particulier, vip, revendeur)', example: 'vip', default: 'particulier' })
  @IsString()
  @IsOptional()
  category?: string = 'particulier';

  @ApiPropertyOptional({ description: 'Notes & préférences du bijoutier', example: 'Préfère or 18k, bague taille 54' })
  @IsString()
  @IsOptional()
  notes?: string;
}
