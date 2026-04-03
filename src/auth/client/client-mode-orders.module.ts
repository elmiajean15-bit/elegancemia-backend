import { Module } from "@nestjs/common";
import { ClientModeOrdersController } from "./client-mode-orders.controller";
import { ClientModeOrdersService } from "./client-mode-orders.service";
import { PrismaService } from "src/database/prisma.service";
import { ClientConversationController } from "./client-conversation.controller";
import { ChatModule } from "src/chat/chat.module";
import { ClientModeOrdersFedapayService } from "./client-mode-oders-fedapay.service";
import { ClientModeOrdersWebhookController } from "./client-mode-orders-webhook.controller";

@Module({
  imports: [ChatModule],
  controllers: [ClientModeOrdersController, ClientConversationController, ClientModeOrdersWebhookController],
  providers: [ClientModeOrdersService, ClientModeOrdersFedapayService, PrismaService],
})
export class ClientModeOrdersModule {}