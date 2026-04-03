// client/client-payment.controller.ts
import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ClientPaymentService } from "./client-payment.service";
import { ClientAuthGuard } from "src/common/guards/client-auth.guard";

@Controller("client/payments")
@UseGuards(ClientAuthGuard)
export class ClientPaymentController {
  constructor(private service: ClientPaymentService) {}

  @Get()
  findMyPayments(@Req() req: any) {
    return this.service.findMyPayments(req.user.id);
  }
}