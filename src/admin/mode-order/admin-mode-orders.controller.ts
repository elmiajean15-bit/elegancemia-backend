import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AdminModeOrdersService } from "./admin-mode-orders.service";
import { CustomOrderStatus } from "../../../generated/prisma/enums";
import { AdminAuthGuard } from "src/common/guards/admin-auth.guard";
import { ConversationsService } from "src/chat/conversations.service";

@Controller("admin/mode-orders")
export class AdminModeOrdersController {
  constructor(private service: AdminModeOrdersService,private conversationsService: ConversationsService) {}

  @UseGuards(AdminAuthGuard)
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @UseGuards(AdminAuthGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @UseGuards(AdminAuthGuard)
  @Patch(":id/status")
  updateStatus(
    @Param("id") id: string,
    @Body("status") status: CustomOrderStatus,
  ) {
    return this.service.updateStatus(id, status);
  }

  /* 💬 CHAT */

  @UseGuards(AdminAuthGuard)
  @Post(":id/conversation")
  startConversation(@Param("id") id: string) {
    return this.service.startConversation(id);
  }

  @UseGuards(AdminAuthGuard)
  @Post("conversation/:id/message")
  sendMessage(
    @Param("id") id: string,
    @Body("content") content: string,
    @Body("senderType") senderType: "admin" | "client",
  ) {
    return this.service.sendMessage(id, content, senderType);
  }

  @UseGuards(AdminAuthGuard)
  @Patch("conversation/:id/close")
  closeConversation(@Param("id") id: string) {
    return this.service.closeConversation(id);
  }

  @UseGuards(AdminAuthGuard)
  @Get("conversation/:id/messages")
  getMessages(@Param("id") id: string) {
    return this.conversationsService.getMessages(id);
  }

  @Patch(":id/price")
  setPrice(
    @Param("id") id: string,
    @Body("amount") amount: number,
  ) {
    return this.service.setFinalPrice(id, amount);
  }
}