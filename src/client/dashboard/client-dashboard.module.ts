import { Module } from "@nestjs/common";
import { ClientDashboardService } from "./client-dashboard.service";
import { ClientDashboardController } from "./client-dashboard.controller";
import { PrismaService } from "src/database/prisma.service";

@Module({
  providers: [ClientDashboardService, PrismaService],
  controllers: [ClientDashboardController],
})
export class ClientDashboardModule {}