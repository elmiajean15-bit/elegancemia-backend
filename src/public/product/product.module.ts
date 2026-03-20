// product.module.ts

import { Module } from '@nestjs/common';
import { PublicProductService } from './product.service';
import { PublicProductController } from './product.controller';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [PublicProductController],
  providers: [PublicProductService, PrismaService],
})
export class PublicProductModule {}
