// client/client-payment.module.ts
import { Module } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { AdminProfileController } from "./admin-profile.controller";
import { AdminProfileService } from "./admin-profile.service";

@Module({
  controllers: [AdminProfileController],
  providers: [AdminProfileService, PrismaService],
})
export class AdminProfileModule {}