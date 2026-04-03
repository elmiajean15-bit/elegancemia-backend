// admin-orders.module.ts
import { Module } from "@nestjs/common";
import { AdminOrdersController } from "./admin-orders.controller";
import { AdminOrdersService } from "./admin-orders.service";
import { PrismaService } from "src/database/prisma.service";

@Module({
  controllers: [AdminOrdersController],
  providers: [AdminOrdersService, PrismaService],
})
export class AdminOrdersModule {}