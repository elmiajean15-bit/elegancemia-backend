import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ClientDashboardService } from "./client-dashboard.service";
import { ClientAuthGuard } from "src/common/guards/client-auth.guard";

@Controller("client/dashboard")
export class ClientDashboardController {
  constructor(private service: ClientDashboardService) {}

  @UseGuards(ClientAuthGuard)
  @Get("stats")
  async getStats(@Req() req: any) {
    return this.service.getStats(req.user.userId);
  }
}