import { Module } from '@nestjs/common';
import { ModeOrderController } from './mode-order.controller';
import { ModeOrderService } from './mode-order.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [ModeOrderController],
  providers: [ModeOrderService, PrismaService],
})
export class ModeOrderModule {}
