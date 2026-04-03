// conversations.service.ts
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Conversation, Message } from "generated/prisma/client";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class ConversationsService {
  constructor(private prisma: PrismaService) {}

  // Crée ou récupère une conversation pour une commande
  async getOrCreate(orderId: string): Promise<Conversation> {
    let convo = await this.prisma.conversation.findFirst({
      where: { orderId },
    });

    if (!convo) {
      convo = await this.prisma.conversation.create({
        data: { orderId },
      });
    }

    return convo;
  }

  // Récupère les messages d'une conversation
  async getMessages(conversationId: string): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    });
  }

  // Ajoute un message à une conversation
  async addMessage(
    conversationId: string,
    content: string,
    senderType: "admin" | "client",
  ): Promise<Message> {
    const convo = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });
    if (!convo) throw new NotFoundException("Conversation not found");

    return this.prisma.message.create({
      data: { conversationId, content, senderType },
    });
  }

  // Clôturer une conversation
  /* ================= CLOSE ================= */
  async closeConversation(conversationId: string) {
    const convo = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { order: true },
    });

    if (!convo) {
      throw new BadRequestException("Conversation introuvable");
    }

    // 🔥 règle métier
    if (convo.order.status !== "completed") {
      throw new BadRequestException(
        "Impossible de clôturer une commande non terminée",
      );
    }

    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: { isOpen: false },
    });
  }

  async getConversation(conversationId: string): Promise<Conversation | null> {
    return this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });
  }
}