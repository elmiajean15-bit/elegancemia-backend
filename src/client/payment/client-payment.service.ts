// client/client-payment.service.ts
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class ClientPaymentService {
  constructor(private prisma: PrismaService) {}

  async findMyPayments(clientId: string) {
    return this.prisma.payment.findMany({
      where: {
        OR: [
          {
            order: {
              clientId,
            },
          },
          {
            customModeOrder: {
              clientId,
            },
          },
        ],
      },
      include: {
        order: {
          select: {
            id: true,
            total: true,
            status: true,
          },
        },
        customModeOrder: {
          select: {
            id: true,
            finalPrice: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}