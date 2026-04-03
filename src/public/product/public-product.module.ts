// product.module.ts

import { Module } from '@nestjs/common';
import { PublicProductService } from './public-product.service';
import { PublicProductController } from './public-product.controller';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [PublicProductController],
  providers: [PublicProductService, PrismaService],
})
export class PublicProductModule {}
