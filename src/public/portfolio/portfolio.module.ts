// public-portfolio.module.ts

import { Module } from '@nestjs/common';
import { PublicPortfolioService } from './portfolio.service';
import { PublicPortfolioController } from './portfolio.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [PublicPortfolioController],
  providers: [PublicPortfolioService, PrismaService],
})
export class PublicPortfolioModule {}
