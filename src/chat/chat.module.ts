import { Module } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { ConversationsService } from "./conversations.service";
import { ChatGateway } from "./chat.gateway";

@Module({
  providers: [ChatGateway, ConversationsService, PrismaService],
  exports: [ConversationsService],
})
export class ChatModule {}