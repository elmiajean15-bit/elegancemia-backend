// client/profile/client-profile.module.ts
import { Module } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { ClientProfileService } from "./client-profile.service";
import { ClientProfileController } from "./client-profile.controller";

@Module({
  controllers: [ClientProfileController],
  providers: [ClientProfileService, PrismaService],
})
export class ClientProfileModule {}