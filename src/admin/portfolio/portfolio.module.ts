import { Module } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';

@Module({
  controllers: [PortfolioController],
  providers: [PortfolioService, PrismaService],
})
export class PortfolioModule {}
