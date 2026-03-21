// review.module.ts

import { Module } from '@nestjs/common';
import { PublicReviewService } from './review.service';
import { PublicReviewController } from './review.controller';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [PublicReviewController],
  providers: [PublicReviewService, PrismaService],
})
export class PublicReviewModule {}
