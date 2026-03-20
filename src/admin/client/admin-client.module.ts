import { Module } from '@nestjs/common';
import { AdminClientController } from './admin-client.controller';
import { AdminClientService } from './admin-client.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [AdminClientController],
  providers: [AdminClientService, PrismaService],
})
export class AdminClientModule {}
