import { Module } from "@nestjs/common";
import { AdminShippingService } from "./shipping.service";
import { AdminShippingController } from "./shipping.controller";
import { PrismaService } from "src/database/prisma.service";

@Module({
  controllers: [AdminShippingController],
  providers: [AdminShippingService, PrismaService],
  exports: [AdminShippingService],
})
export class AdminShippingModule {}