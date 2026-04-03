// client-mode-orders.service.ts
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { ClientModeOrdersFedapayService } from "./client-mode-oders-fedapay.service";

@Injectable()
export class ClientModeOrdersService {
  constructor(private prisma: PrismaService, 
      private fedapayService: ClientModeOrdersFedapayService) {}

  /* ===============================
     📦 MES COMMANDES
  =============================== */
  async findMyOrders(clientId: string) {
    return this.prisma.customModeOrder.findMany({
      where: { clientId },
      include: {
        conversations: true,
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /* ===============================
     🔎 DETAIL
  =============================== */
  async findOne(id: string, clientId: string) {
    return this.prisma.customModeOrder.findFirst({
      where: { id, clientId },
      include: {
        conversations: {
          include: { messages: true },
        },
      },
    });
  }

  /* ===============================
     💰 CALCUL PAIEMENT
  =============================== */
  computePayment(order: any) {
    const total = Number(order.budget);

    const paid = order.payments.reduce(
      (acc: number, p: any) => acc + p.amount,
      0
    );

    if (order.status === "pending") {
      return total * 0.5;
    }

    if (order.status === "in_progress") {
      return total - paid;
    }

    return 0;
  }

  async pay(
  clientId: string,
  orderId: string,
  country: string,
  type: "deposit" | "remaining",
) {
  const order = await this.prisma.customModeOrder.findUnique({
    where: { id: orderId },
  });

  if (!order || order.clientId !== clientId) {
    throw new Error("Commande invalide");
  }

  if (!order.finalPrice) {
    throw new Error("Prix non défini");
  }

  if (!order.telephone) {
    throw new Error("Téléphone requis");
  }

  /* ===============================
     💰 CALCUL MONTANT
  =============================== */
  let amount = 0;

  if (type === "deposit") {
    amount = order.finalPrice / 2;
  } else {
    amount = order.finalPrice - order.paidAmount;
  }

  if (amount <= 0) {
    throw new Error("Montant invalide");
  }

  /* ===============================
     🔐 REFERENCE
  =============================== */
  const reference = `MODE-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  /* ===============================
     💳 FEDAPAY
  =============================== */
  const paymentData = await this.fedapayService.createTransaction({
    amount,
    name: order.nom || "Client",
    email: order.email || undefined,
    phone: order.telephone,
    orderId: order.id,
    countryCode: country,
  });

  /* ===============================
     💾 SAVE PAYMENT
  =============================== */
  await this.prisma.payment.create({
    data: {
      method: "mobile_money",
      amount: amount,
      currency: "FCFA",
      status: "pending",

      fedapayId: String(paymentData.transactionId),
      paymentUrl: paymentData.paymentUrl,
      reference: reference,

      customModeOrderId: order.id,
    },
  });

  return {
    paymentUrl: paymentData.paymentUrl,
  };
}
}