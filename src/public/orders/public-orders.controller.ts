// orders.controller.ts
import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { PublicOrdersService } from "./public-orders.service";
import { PrismaService } from "src/database/prisma.service";

@Controller("public/orders")
export class PublicOrdersController {
  constructor(private readonly ordersService: PublicOrdersService, private prisma: PrismaService) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(dto);
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