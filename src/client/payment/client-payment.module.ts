// client/client-payment.module.ts
import { Module } from "@nestjs/common";
import { ClientPaymentController } from "./client-payment.controller";
import { ClientPaymentService } from "./client-payment.service";
import { PrismaService } from "src/database/prisma.service";

@Module({
  controllers: [ClientPaymentController],
  providers: [ClientPaymentService, PrismaService],
})
export class ClientPaymentModule {}