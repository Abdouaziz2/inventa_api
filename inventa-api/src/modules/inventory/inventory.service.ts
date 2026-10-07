import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItemDto } from './dto/create-item.dto';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    try {
      return await this.prisma.jewelleryItem.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      // Fallback si la base n'est pas encore migrée
      return [];
    }
  }

  async create(dto: CreateItemDto) {
    this.logger.log(`Création d'un nouvel article de bijouterie : ${dto.name}`);
    return await this.prisma.jewelleryItem.create({
      data: {
        name: dto.name,
        sku: dto.sku,
        category: dto.category,
        metalType: dto.metalType,
        karat: dto.karat || 18,
        weightGrams: dto.weightGrams,
        priceSell: dto.priceSell,
        priceBuy: dto.priceBuy,
        stockQty: dto.stockQty ?? 1,
        imageUrl: dto.imageUrl,
      },
    });
  }
}
