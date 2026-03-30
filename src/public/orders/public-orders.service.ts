// orders.service.ts
import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { PublicFedapayService } from "./public-fedapay.service";
import { randomUUID } from "crypto";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class PublicOrdersService {
  constructor(
    private prisma: PrismaService,
    private fedapay: PublicFedapayService
  ) {}

  async createOrder(dto: CreateOrderDto) {

    if (!dto.customer.countryCode) {
      throw new BadRequestException("Pays requis");
    }

    if (!dto.customer.phone) {
      throw new BadRequestException("Téléphone requis");
    }

    // 🔐 référence unique
    const reference = `CMD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // 🧾 récupérer produits
    const products = await this.prisma.product.findMany({
      where: {
        id: { in: dto.items.map(i => i.productId) }
      }
    });

    // 🧮 construire items
    const orderItems = dto.items.map(item => {
      const product = products.find(p => p.id === item.productId);

      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        name: product.name,
      };
    });

    // 🧾 créer commande
    const order = await this.prisma.order.create({
      data: {
        total: dto.total,
        currency: "FCFA",
        status: "PENDING",
        paymentStatus: "pending",
        paymentReference: reference,

        fullName: dto.customer.fullName,
        phone: dto.customer.phone,
        email: dto.customer.email,
        address: dto.customer.address,

        shippingMethod: {
          connect: {
            id: dto.shippingMethodId,
          },
        },

        items: {
          create: orderItems,
        },
      },
      include: { items: true },
    });

    // 💳 créer paiement FedaPay
    const paymentData = await this.fedapay.createTransaction({
      amount: order.total,
      name: order.fullName,
      phone: order.phone,
      email: order.email || undefined,
      orderId: order.id,
      countryCode: dto.customer.countryCode,
    });

    // 💾 enregistrer paiement
    await this.prisma.payment.create({
      data: {
        method: "mobile_money",
        amount: order.total,
        currency: "FCFA",
        status: "pending",

        fedapayId: String(paymentData.transactionId),
        paymentUrl: paymentData.paymentUrl,
        reference: reference,

        orderId: order.id,
      },
    });

    return {
      paymentUrl: paymentData.paymentUrl,
      orderId: order.id,
    };
  }
}