import { Module } from "@nestjs/common";
import { AdminDashboardService } from "./admin-dashboard.service";
import { AdminDashboardController } from "./admin-dashboard.controller";
import { PrismaService } from "src/database/prisma.service";

@Module({
  providers: [AdminDashboardService, PrismaService],
  controllers: [AdminDashboardController],
})
export class AdminDashboardModule {}