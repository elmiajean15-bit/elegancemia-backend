// client-conversation.controller.ts
import { Controller, Get, Param, Post, Body, UseGuards, Req } from "@nestjs/common";
import { ConversationsService } from "src/chat/conversations.service";
import { ClientAuthGuard } from "src/common/guards/client-auth.guard";

@Controller("client/conversations")
export class ClientConversationController {
  constructor(private convoService: ConversationsService) {}

  @UseGuards(ClientAuthGuard)
  @Get(":orderId")
  getOrCreate(@Param("orderId") orderId: string) {
    return this.convoService.getOrCreate(orderId);
  }

  @UseGuards(ClientAuthGuard)
  @Get(":id/messages")
  getMessages(@Param("id") id: string) {
    return this.convoService.getMessages(id);
  }

  @UseGuards(ClientAuthGuard)
  @Post(":id/message")
  sendMessage(
    @Param("id") id: string,
    @Body("content") content: string,
  ) {
    return this.convoService.addMessage(id, content, "client");
  }
}