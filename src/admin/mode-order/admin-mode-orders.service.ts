import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { CustomOrderStatus } from "../../../generated/prisma/enums";

@Injectable()
export class AdminModeOrdersService {
  constructor(private prisma: PrismaService) {}

  /* ===============================
     📦 GET ALL ORDERS
  =============================== */
  async findAll() {
    return this.prisma.customModeOrder.findMany({
      include: {
        client: true,
        guestClient: true,
        conversations: {
          include: {
            messages: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /* ===============================
     🔎 GET ONE
  =============================== */
  async findOne(id: string) {
    return this.prisma.customModeOrder.findUnique({
      where: { id },
      include: {
        client: true,
        guestClient: true,
        conversations: {
          include: {
            messages: true,
          },
        },
      },
    });
  }

  /* ===============================
     🔄 UPDATE STATUS
  =============================== */
  async updateStatus(id: string, status: CustomOrderStatus) {
    return this.prisma.customModeOrder.update({
      where: { id },
      data: { status },
    });
  }

  /* ===============================
     💬 CREATE CONVERSATION
  =============================== */
  async startConversation(orderId: string) {
    const existing = await this.prisma.conversation.findFirst({
      where: { orderId },
    });

    if (existing) return existing;

    return this.prisma.conversation.create({
      data: { orderId },
    });
  }
  
  /* ===============================
     ❌ CLOSE CONVERSATION
  =============================== */
  async closeConversation(id: string) {
    return this.prisma.conversation.update({
      where: { id },
      data: { isOpen: false },
    });
  }

  /* ===============================
     ✉️ SEND MESSAGE
  =============================== */
  async sendMessage(
    conversationId: string,
    content: string,
    senderType: "admin" | "client",
  ) {
    return this.prisma.message.create({
      data: {
        conversationId,
        content,
        senderType,
      },
    });
  }

  async setFinalPrice(id: string, amount: number) {
    return this.prisma.customModeOrder.update({
      where: { id },
      data: {
        finalPrice: amount,
      },
    });
  }
}
