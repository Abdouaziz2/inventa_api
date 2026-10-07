import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateItemDto } from './dto/create-item.dto';
import { InventoryService } from './inventory.service';

@ApiTags('Inventaire & Bijoux')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @ApiOperation({ summary: 'Lister les bijoux en stock' })
  @ApiResponse({ status: 200, description: 'Liste des articles' })
  findAll() {
    return this.inventoryService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Ajouter un bijou au stock' })
  @ApiResponse({ status: 201, description: 'Article créé avec succès' })
  create(@Body() dto: CreateItemDto) {
    return this.inventoryService.create(dto);
  }
}
