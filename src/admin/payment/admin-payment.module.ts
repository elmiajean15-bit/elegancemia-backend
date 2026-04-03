// admin/admin-payment.module.ts
import { Module } from "@nestjs/common";
import { AdminPaymentController } from "./admin-payment.controller";
import { AdminPaymentService } from "./admin-payment.service";
import { PrismaService } from "src/database/prisma.service";

@Module({
  controllers: [AdminPaymentController],
  providers: [AdminPaymentService, PrismaService],
})
export class AdminPaymentModule {}