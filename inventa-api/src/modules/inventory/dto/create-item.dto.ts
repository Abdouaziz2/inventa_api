import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateItemDto {
  @ApiProperty({ description: 'Désignation du bijou', example: 'Bague solitaire or blanc 18k' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Code barre ou référence SKU', example: 'BAG-OR-001' })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiProperty({ description: 'Catégorie', example: 'bague', default: 'bague' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ description: 'Métal précieux', example: 'or', default: 'or' })
  @IsString()
  @IsNotEmpty()
  metalType: string;

  @ApiProperty({ description: 'Carats (18k, 21k, 22k, 24k)', example: 18, default: 18 })
  @IsNumber()
  @IsOptional()
  karat?: number = 18;

  @ApiProperty({ description: 'Poids net en grammes', example: 4.5, default: 0 })
  @IsNumber()
  @Min(0)
  weightGrams: number;

  @ApiPropertyOptional({ description: 'Prix de vente en FCFA (ou 0 si fixé lors de la vente)', example: 0, default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  priceSell?: number = 0;

  @ApiPropertyOptional({ description: 'Prix de revient ou d’achat en FCFA', example: 140000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  priceBuy?: number;

  @ApiProperty({ description: 'Quantité en stock', example: 1, default: 1 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  stockQty?: number = 1;

  @ApiPropertyOptional({ description: 'URL de la photo du bijou' })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}
