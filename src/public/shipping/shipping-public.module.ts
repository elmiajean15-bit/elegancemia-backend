import { Module } from "@nestjs/common";
import { ShippingPublicController } from "./shipping-public.controller";
import { ShippingPublicService } from "./shipping-public.service";
import { PrismaService } from "../../database/prisma.service";

@Module({
  controllers: [ShippingPublicController],
  providers: [ShippingPublicService, PrismaService],
  exports: [ShippingPublicService],
})
export class ShippingPublicModule {}