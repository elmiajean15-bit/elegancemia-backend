import { Controller, Get, UseGuards } from "@nestjs/common";
import { AdminDashboardService } from "./admin-dashboard.service";
import { AdminAuthGuard } from "src/common/guards/admin-auth.guard";


@Controller("admin/dashboard")
export class AdminDashboardController {
  constructor(private dashboardService: AdminDashboardService) {}

  @UseGuards(AdminAuthGuard)
  @Get("stats")
  async getStats() {
    return this.dashboardService.getStats();
  }
}