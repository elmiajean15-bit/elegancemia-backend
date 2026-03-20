// product.controller.ts

import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('public/products')
export class ProductController {
  constructor(private readonly service: ProductService) {}

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
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.service.findOneBySlug(slug);
  }
}
