// client-mode-orders.controller.ts
import { Controller, Get, Param, UseGuards, Req, Post, Body, Query } from "@nestjs/common";
import { ClientModeOrdersService } from "./client-mode-orders.service";
import { ClientAuthGuard } from "src/common/guards/client-auth.guard";
import { PrismaService } from "src/database/prisma.service";

@Controller("client/mode-orders")
export class ClientModeOrdersController {
  constructor(private service: ClientModeOrdersService, private prisma: PrismaService) {}

  @UseGuards(ClientAuthGuard)
  @Get()
  getMyOrders(@Req() req) {
    return this.service.findMyOrders(req.user.id);
  }

  @UseGuards(ClientAuthGuard)
  @Get(":id")
  getOne(@Param("id") id: string, @Req() req) {
    return this.service.findOne(id, req.user.id);
  }

  
  @Post("pay")
  @UseGuards(ClientAuthGuard)
  pay(
    @Req() req,
    @Body("orderId") orderId: string,
    @Body("country") country: string,
    @Body("type") type: "deposit" | "remaining",
  ){
    return this.service.pay(req.user.userId, orderId, country, type);
  }

  @Get("payments/verify")
  async verify(@Query("id") transactionId: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { fedapayId: transactionId },
    });

    if (!payment) {
      return { status: "error" };
    }

    return { status: payment.status };
  }
}