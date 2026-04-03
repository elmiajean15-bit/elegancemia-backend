import {
  Controller,
  Post,
  Req,
  Headers,
  HttpCode,
} from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import * as crypto from "crypto";

@Controller("webhooks/fedapay/orders")
export class PublicWebhookController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(200)
  async handle(
    @Req() req: any,
    @Headers("x-fedapay-signature") signatureHeader: string,
  ) {
    try {
      const rawBody = req.rawBody;
      const secret = process.env.FEDAPAY_WEBHOOK_SECRET_ORDER;

      /* ===============================
         🔐 1. VERIFY SIGNATURE (robuste)
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
        console.error("❌ Format signature invalide", signatureHeader);
        return;
      }

      const timestamp = match[1];
      const signature = match[2];

      const payloadToSign = `${timestamp}.${rawBody}`;

      const computedSignature = crypto
        .createHmac("sha256", secret)
        .update(payloadToSign)
        .digest("hex");

      if (
        !crypto.timingSafeEqual(
          Buffer.from(computedSignature),
          Buffer.from(signature),
        )
      ) {
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
        console.error("❌ Transaction absente");
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
        where: {
          fedapayId: transactionId,
        },
      });

      if (!payment) {
        console.warn("⚠️ Paiement introuvable:", transactionId);
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
         ⏳ 5. PENDING
      =============================== */
      if (status === "pending") {
        await this.prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "pending",
            rawResponse: body,
          },
        });

        console.log("⏳ Paiement en attente");
        return;
      }

      /* ===============================
         ✅ 6. SUCCESS
      =============================== */
      if (paidStatuses.includes(status)) {
        await this.prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "success",
            rawResponse: body,
          },
        });

        if (payment.orderId) {
          await this.prisma.order.update({
            where: { id: payment.orderId },
            data: {
              status: "PAID",
              paymentStatus: "success",
            },
          });
        }

        console.log("✅ Paiement validé:", transactionId);
        return;
      }

      /* ===============================
         ❌ 7. FAILED
      =============================== */
      if (["declined", "canceled"].includes(status)) {
        await this.prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "failed",
            rawResponse: body,
          },
        });

        if (payment.orderId) {
          await this.prisma.order.update({
            where: { id: payment.orderId },
            data: {
              status: "FAILED",
              paymentStatus: "failed",
            },
          });
        }

        console.log("❌ Paiement échoué:", transactionId);
        return;
      }

      console.log("⚠️ Statut non géré:", status);

    } catch (error) {
      console.error("🔥 Webhook error:", error);
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
// export class PublicWebhookController {
//   constructor(private prisma: PrismaService) {}

//   @Post()
//   @HttpCode(200)
//   async handle(
//     @Req() req: any,
//     @Headers("x-fedapay-signature") signature: string,
//   ) {
//     try {
//       const rawBody = req.rawBody;

//       // 🔐 1. Vérification signature
//       const isValid = WebhookSignature.verifyHeader(
//         rawBody,
//         signature,
//         process.env.FEDAPAY_WEBHOOK_SECRET,
//       );

//       if (!isValid) {
//         console.error("❌ Signature invalide");
//         return;
//       }

//       const body = JSON.parse(rawBody);
//       const transaction = body.entity;

//       if (!transaction) {
//         console.error("❌ Transaction absente");
//         return;
//       }

//       // 🔍 2. Récupérer paiement
//       const payment = await this.prisma.payment.findFirst({
//         where: {
//           fedapayId: String(transaction.id),
//         },
//       });

//       if (!payment) {
//         console.warn("⚠️ Paiement introuvable", transaction.id);
//         return;
//       }

//       // 🛑 3. IDPOTENCE (éviter double traitement)
//       if (payment.status === "success") {
//         console.log("⚠️ Déjà traité");
//         return;
//       }

//       if (transaction.status === "pending") {
//         await this.prisma.payment.update({
//           where: { id: payment.id },
//           data: {
//             status: "pending",
//             rawResponse: body,
//           },
//         });
//       }

//       // ✅ 4. SUCCÈS
//       if (transaction.status === 'approved' || transaction.status === 'transferred' || transaction.status === 'paid' || transaction.status === 'completed' || transaction.status === 'success') {
//         await this.prisma.payment.update({
//           where: { id: payment.id },
//           data: {
//             status: "success",
//             rawResponse: body,
//           },
//         });

//         await this.prisma.order.update({
//           where: { id: payment.orderId },
//           data: {
//             status: "PAID",
//             paymentStatus: "success",
//           },
//         });

//         console.log("✅ Paiement validé:", transaction.id);
//       } else {
//         await this.prisma.payment.update({
//           where: { id: payment.id },
//           data: {
//             status: "failed",
//             rawResponse: body,
//           },
//         });

//         await this.prisma.order.update({
//           where: { id: payment.orderId },
//           data: {
//             status: "FAILED",
//             paymentStatus: "failed",
//           },
//         });

//         console.log("❌ Paiement échoué:", transaction.id);
//       }

//     } catch (error) {
//       console.error("🔥 Webhook error:", error);
//     }
//   }
// }


// // webhook.controller.ts
// import { Body, Controller, Post } from "@nestjs/common";
// import { PrismaService } from "../../database/prisma.service";

// @Controller("webhooks/fedapay")
// export class PublicWebhookController {
//   constructor(private prisma: PrismaService) {}

//   @Post()
//   async handle(@Body() body: any) {
//     try {
//       const transaction = body.entity;

//       const payment = await this.prisma.payment.findFirst({
//         where: {
//           fedapayId: String(transaction.id),
//         },
//       });

//       if (!payment) return;

//       // ✅ succès
//       if (transaction.status === "approved") {
//         await this.prisma.payment.update({
//           where: { id: payment.id },
//           data: { status: "success", rawResponse: body },
//         });

//         await this.prisma.order.update({
//           where: { id: payment.orderId },
//           data: {
//             status: "PAID",
//             paymentStatus: "success",
//           },
//         });
//       }

//       // ❌ échec
//       if (transaction.status === "declined") {
//         await this.prisma.payment.update({
//           where: { id: payment.id },
//           data: { status: "failed", rawResponse: body },
//         });

//         await this.prisma.order.update({
//           where: { id: payment.orderId },
//           data: {
//             status: "FAILED",
//             paymentStatus: "failed",
//           },
//         });
//       }

//     } catch (error) {
//       console.error("Webhook error:", error);
//     }
//   }
// }