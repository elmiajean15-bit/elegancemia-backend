// orders.controller.ts
import { Body, Controller, Post } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { PublicOrdersService } from "./public-orders.service";

@Controller("public/orders")
export class PublicOrdersController {
  constructor(private readonly ordersService: PublicOrdersService) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(dto);
  }
}