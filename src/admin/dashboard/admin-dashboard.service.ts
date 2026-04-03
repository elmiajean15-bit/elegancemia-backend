import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";


@Injectable()
export class AdminDashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const totalProducts = await this.prisma.product.count();
    const totalOrders = await this.prisma.order.count();
    const totalClients = await this.prisma.client.count();
    const totalRevenueObj = await this.prisma.order.aggregate({
      _sum: { total: true },
    });
    const totalRevenue = totalRevenueObj._sum.total || 0;

    // commandes récentes
    const recentOrders = await this.prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { items: { include: { product: true } } },
    });

    return { totalProducts, totalOrders, totalClients, totalRevenue, recentOrders };
  }
}