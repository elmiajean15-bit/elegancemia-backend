// client-orders.module.ts
import { Module } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { ClientOrdersController } from "./client-orders.controller";
import { ClientOrdersService } from "./client-orders.service";

@Module({
  controllers: [ClientOrdersController],
  providers: [ClientOrdersService, PrismaService],
})
export class ClientOrdersModule {}