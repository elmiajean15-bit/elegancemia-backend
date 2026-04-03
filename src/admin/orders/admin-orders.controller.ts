// admin-orders.controller.ts
import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  UseGuards,
  Query,
} from "@nestjs/common";
import { AdminOrdersService } from "./admin-orders.service";
import { AdminAuthGuard } from "src/common/guards/admin-auth.guard";

@Controller("admin/orders")
@UseGuards(AdminAuthGuard)
export class AdminOrdersController {
  constructor(private service: AdminOrdersService) {}

  @Get()
  async getOrders(@Query('status') status?: string) {
    return this.service.findAll(status);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Patch(":id/status")
  updateStatus(
    @Param("id") id: string,
    @Body("status") status: string,
  ) {
    return this.service.updateStatus(id, status);
  }
}