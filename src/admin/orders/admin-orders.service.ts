// admin-orders.service.ts
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class AdminOrdersService {
    constructor(private prisma: PrismaService) { }

    // 📦 toutes les commandes
    async findAll(status?: string) {
        return this.prisma.order.findMany({
            where: status ? { status } : {},
            include: {
                items: {
                    include: {
                        product: { include: { images: true } },
                    },
                },
                shippingMethod: true,
                payments: true,
            },
            orderBy: { createdAt: "desc" },
        });
    }

    // 📦 une commande
    async findOne(id: string) {
        return this.prisma.order.findUnique({
            where: { id },
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

    // 🔄 update status
    async updateStatus(id: string, status: string) {
        return this.prisma.order.update({
            where: { id },
            data: { status },
        });
    }
}