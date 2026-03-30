// orders.module.ts
import { Module } from "@nestjs/common";
import { PublicOrdersController } from "./public-orders.controller";
import { PublicOrdersService } from "./public-orders.service";
import { PublicWebhookController } from "./public-webhook.controller";
import { PublicFedapayService } from "./public-fedapay.service";
import { PrismaService } from "../../database/prisma.service";

@Module({
  controllers: [PublicOrdersController, PublicWebhookController],
  providers: [PublicOrdersService, PublicFedapayService, PrismaService],
})
export class PublicOrdersModule {}