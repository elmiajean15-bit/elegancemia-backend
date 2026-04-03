// client-orders.service.ts
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class ClientOrdersService {
  constructor(private prisma: PrismaService) {}

  // 📦 mes commandes
  async findMyOrders(clientId: string, status?: string) {
    return this.prisma.order.findMany({
      where: { clientId, ...(status ? { status } : {}) },
      include: {
        items: { include: { product: { include: { images: true } } } },
        shippingMethod: true,
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // 📦 détail
  async findOne(clientId: string, orderId: string) {
    return this.prisma.order.findFirst({
      where: {
        id: orderId,
        clientId,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true, // ✅ inclure les images
              },
            },
          },
        },
        shippingMethod: true,
        payments: true,
      },
    });
  }
}