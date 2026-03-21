// product.controller.ts

import { Controller, Get, Param, Query } from '@nestjs/common';
import { PublicProductService } from './product.service';
import { ProductCategory } from 'generated/prisma/enums';

@Controller('public/products')
export class PublicProductController {
  constructor(private readonly service: PublicProductService) {}

  // ✅ GET FEATURED
  @Get('featured')
  findFeatured() {
    return this.service.findFeatured(3);
  }

  // ✅ GET ALL (avec filtres)
  @Get()
  findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  // ✅ GET ONE (slug)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOneById(id);
  }

  @Get('related')
  findRelated(
    @Query('category') category: ProductCategory,
    @Query('excludeId') excludeId?: string,
  ) {
    return this.service.findRelated(category, excludeId);
  }
}
