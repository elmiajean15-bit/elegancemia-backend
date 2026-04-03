import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class ClientDashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(clientId: string) {
    /* =========================
       📦 COMMANDES PRODUITS
    ========================= */
    const totalOrders = await this.prisma.order.count({
      where: { clientId },
    });

    const inProgressOrders = await this.prisma.order.count({
      where: {
        clientId,
        status: {
          in: ["PENDING", "PROCESSING", "SHIPPED"],
        },
      },
    });

    /* =========================
       👗 SUR MESURE
    ========================= */
    const totalCustomOrders = await this.prisma.customModeOrder.count({
      where: { clientId },
    });

    /* =========================
       💳 PAIEMENTS
    ========================= */
    const totalPayments = await this.prisma.payment.count({
      where: {
        OR: [
          { order: { clientId } },
          { customModeOrder: { clientId } },
        ],
      },
    });

    /* =========================
       🕒 COMMANDES RÉCENTES
    ========================= */
    const recentOrders = await this.prisma.order.findMany({
      where: { clientId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });

    /* =========================
       💰 PAIEMENTS RÉCENTS
    ========================= */
    const recentPayments = await this.prisma.payment.findMany({
      where: {
        OR: [
          { order: { clientId } },
          { customModeOrder: { clientId } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return {
      totalOrders,
      totalCustomOrders,
      totalPayments,
      inProgressOrders,
      recentOrders,
      recentPayments,
    };
  }
}