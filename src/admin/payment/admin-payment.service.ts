// admin/admin-payment.service.ts
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { AdminPaymentQueryDto } from "./dto/admin-payment-query.dto";

@Injectable()
export class AdminPaymentService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: AdminPaymentQueryDto) {
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 10);

    return this.prisma.payment.findMany({
      where: {
        ...(query.status && { status: query.status }),
        ...(query.method && { method: query.method as any }),
      },
      include: {
        order: {
          select: {
            id: true,
            fullName: true,
            total: true,
          },
        },
        customModeOrder: {
          select: {
            id: true,
            nom: true,
            finalPrice: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findOne(id: string) {
    return this.prisma.payment.findUnique({
      where: { id },
      include: {
        order: {
          include: { items: true },
        },
        customModeOrder: true,
      },
    });
  }
}