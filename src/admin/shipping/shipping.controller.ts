import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { AdminShippingService } from "./shipping.service";
import { CreateShippingDto } from "./dto/create-shipping.dto";
import { UpdateShippingDto } from "./dto/update-shipping.dto";

@Controller("admin/shipping")
export class AdminShippingController {
  constructor(private readonly shippingService: AdminShippingService) {}

  // 🔐 ADMIN - CREATE
  @Post()
  create(@Body() dto: CreateShippingDto) {
    return this.shippingService.create(dto);
  }

  // 🔐 ADMIN - GET ALL
  @Get()
  findAll() {
    return this.shippingService.findAll();
  }

  // 🌍 PUBLIC - GET ACTIVE
  @Get("active")
  findActive() {
    return this.shippingService.findActive();
  }

  // 🔐 ADMIN - GET ONE
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.shippingService.findOne(id);
  }

  // 🔐 ADMIN - UPDATE
  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateShippingDto) {
    return this.shippingService.update(id, dto);
  }

  // 🔐 ADMIN - DELETE
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.shippingService.remove(id);
  }
}