import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class WaveUrlQueryDto {
  @ApiPropertyOptional({ description: 'Montant à payer en FCFA', default: 11500, example: 11500 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(100)
  amount?: number = 11500;
}
