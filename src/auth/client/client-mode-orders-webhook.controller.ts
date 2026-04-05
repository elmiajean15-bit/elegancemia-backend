import {
  Controller,
  Post,
  Req,
  Headers,
  HttpCode,
} from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import * as crypto from "crypto";

@Controller("webhooks/fedapay/mode-orders")
export class ClientModeOrdersWebhookController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(200)
  async handle(
    @Req() req: any,
    @Headers("x-fedapay-signature") signatureHeader: string,
  ) {
    const rawBody = req.rawBody;
    const secret = process.env.FEDAPAY_WEBHOOK_SECRET_MODE_ORDER;

    /* ===============================
       🔐 1. VERIFY SIGNATURE (comme Laravel)
    =============================== */
    if (!signatureHeader) {
      console.error("❌ Signature manquante");
      return;
    }

    console.log("📨 Webhook reçu", {
        headers: signatureHeader,
        payload: rawBody.slice(0, 200),
    });

    const match = signatureHeader.match(/t=(\d+),s=([a-f0-9]+)/);

    if (!match) {
      console.error("❌ Mauvais format signature");
      return;
    }

    const timestamp = match[1];
    const signature = match[2];

    const payloadToSign = `${timestamp}.${rawBody}`;

    const computedSignature = crypto
      .createHmac("sha256", secret)
      .update(payloadToSign)
      .digest("hex");

    if (!crypto.timingSafeEqual(
      Buffer.from(computedSignature),
      Buffer.from(signature),
    )) {
      console.error("❌ Signature invalide");
      return;
    }

    console.log("✅ Signature validée");

    /* ===============================
       📦 2. PARSE BODY
    =============================== */
    const body = JSON.parse(rawBody);
    const transaction = body.entity;

    if (!transaction) {
      console.warn("⚠️ Transaction absente");
      return;
    }

    const transactionId = String(transaction.id);
    const status = transaction.status;

    console.log("📦 Transaction:", {
      id: transactionId,
      status,
    });

    /* ===============================
       🔍 3. FIND PAYMENT
    =============================== */
    const payment = await this.prisma.payment.findFirst({
      where: { fedapayId: String(transactionId) },
    });

    if (!payment) {
      console.warn("⚠️ Paiement introuvable:", transactionId);
      return;
    }

    if (!payment.customModeOrderId) {
      console.error("❌ customModeOrderId manquant", payment.id);
      return;
    }

    /* ===============================
       🛑 4. IDEMPOTENCE
    =============================== */
    if (payment.status === "success") {
      console.log("⚠️ Déjà traité");
      return;
    }

    const paidStatuses = [
      "approved",
      "transferred",
      "paid",
      "completed",
      "success",
    ];

    /* ===============================
       ✅ 5. SUCCESS
    =============================== */
    if (paidStatuses.includes(status)) {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "success",
          rawResponse: body,
        },
      });

      // 🔥 UPDATE CUSTOM ORDER
      if (payment.customModeOrderId) {
        const order = await this.prisma.customModeOrder.update({
          where: { id: payment.customModeOrderId },
          data: {
            paidAmount: {
              increment: payment.amount,
            },
          },
        });

        /* ===============================
           🎯 UPDATE STATUS BUSINESS
        =============================== */
        if (order.paidAmount + payment.amount >= (order.finalPrice ?? 0)) {
          await this.prisma.customModeOrder.update({
            where: { id: order.id },
            data: { status: "completed" },
          });
        } else {
          await this.prisma.customModeOrder.update({
            where: { id: order.id },
            data: { status: "in_progress", },
          });
        }
      }

      console.log("✅ Paiement validé:", transactionId);
    }

    /* ===============================
       ❌ 6. FAILED
    =============================== */
    else if (["declined", "canceled"].includes(status)) {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "failed",
          rawResponse: body,
        },
      });

      console.log("❌ Paiement échoué:", transactionId);
    }

    /* ===============================
       ⏳ 7. PENDING
    =============================== */
    else {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "pending",
          rawResponse: body,
        },
      });

      console.log("⏳ Paiement en attente");
    }
  }
}



// import {
//   Controller,
//   Post,
//   Req,
//   Headers,
//   HttpCode,
// } from "@nestjs/common";
// import { PrismaService } from "../../database/prisma.service";
// import { WebhookSignature } from "fedapay"; // adapte selon ton import

// @Controller("webhooks/fedapay")
// export class ClientModeOrdersWebhookController {
//   constructor(private prisma: PrismaService) {}
// @Post()
// @HttpCode(200)
// async handle(
//   @Req() req: any,
//   @Headers("x-fedapay-signature") signature: string,
// ) {
//   const rawBody = req.rawBody;

//   const isValid = WebhookSignature.verifyHeader(
//     rawBody,
//     signature,
//     process.env.FEDAPAY_WEBHOOK_SECRET,
//   );

//   if (!isValid) {
//     console.error("❌ Signature invalide");
//     return;
//   }

//   const body = JSON.parse(rawBody);
//   const transaction = body.entity;

//   if (!transaction) return;

//   /* ===============================
//      🔍 FIND PAYMENT
//   =============================== */
//   const payment = await this.prisma.payment.findFirst({
//     where: {
//       fedapayId: String(transaction.id),
//     },
//   });

//   if (!payment) return;

//   /* ===============================
//      🛑 IDPOTENCE
//   =============================== */
//   if (payment.status === "success") return;

//   console.log(transaction, body);
  

//   /* ===============================
//      ✅ SUCCESS
//   =============================== */
//   if (transaction.status === 'approved' || transaction.status === 'transferred' || transaction.status === 'paid' || transaction.status === 'completed' || transaction.status === 'success') {
//     await this.prisma.payment.update({
//       where: { id: payment.id },
//       data: {
//         status: "success",
//         rawResponse: body,
//       },
//     });

//     // 🔥 UPDATE CUSTOM ORDER
//     if (payment.customModeOrderId) {
//       await this.prisma.customModeOrder.update({
//         where: { id: payment.customModeOrderId },
//         data: {
//           paidAmount: {
//             increment: payment.amount,
//           },
//         },
//       });
//     }

//     console.log("✅ Paiement validé");
//   } else {
//     await this.prisma.payment.update({
//       where: { id: payment.id },
//       data: {
//         status: "failed",
//         rawResponse: body,
//       },
//     });
//   }
// }
// }