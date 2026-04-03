// client-orders.controller.ts
import { Controller, Get, Param, Query, Req, UseGuards } from "@nestjs/common";
import { ClientOrdersService } from "./client-orders.service";
import { ClientAuthGuard } from "src/common/guards/client-auth.guard";

@Controller("client/orders")
@UseGuards(ClientAuthGuard)
export class ClientOrdersController {
  constructor(private service: ClientOrdersService) {}

  @Get()
  async getMyOrders(
    @Req() req,
    @Query('status') status?: string,
  ) {
    return this.service.findMyOrders(req.user.id, status);
  }

  @Get(":id")
  findOne(@Req() req: any, @Param("id") id: string) {
    return this.service.findOne(req.user.userId, id);
  }
}