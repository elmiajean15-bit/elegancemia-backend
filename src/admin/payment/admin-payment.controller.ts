// admin/admin-payment.controller.ts
import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AdminPaymentService } from "./admin-payment.service";
import { AdminAuthGuard } from "src/common/guards/admin-auth.guard";
import { AdminPaymentQueryDto } from "./dto/admin-payment-query.dto";

@Controller("admin/payments")
@UseGuards(AdminAuthGuard)
export class AdminPaymentController {
  constructor(private service: AdminPaymentService) {}

  @Get()
  findAll(@Query() query: AdminPaymentQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }
}