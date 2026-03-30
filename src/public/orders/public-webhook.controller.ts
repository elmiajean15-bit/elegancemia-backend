import {
  Controller,
  Post,
  Req,
  Headers,
  HttpCode,
} from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { WebhookSignature } from "fedapay"; // adapte selon ton import

@Controller("webhooks/fedapay")
export class PublicWebhookController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(200)
  async handle(
    @Req() req: any,
    @Headers("x-fedapay-signature") signature: string,
  ) {
    try {
      const rawBody = req.rawBody;

      // 🔐 1. Vérification signature
      const isValid = WebhookSignature.verifyHeader(
        rawBody,
        signature,
        process.env.FEDAPAY_WEBHOOK_SECRET,
      );

      if (!isValid) {
        console.error("❌ Signature invalide");
        return;
      }

      const body = JSON.parse(rawBody);
      const transaction = body.entity;

      if (!transaction) {
        console.error("❌ Transaction absente");
        return;
      }

      // 🔍 2. Récupérer paiement
      const payment = await this.prisma.payment.findFirst({
        where: {
          fedapayId: String(transaction.id),
        },
      });

      if (!payment) {
        console.warn("⚠️ Paiement introuvable", transaction.id);
        return;
      }

      // 🛑 3. IDPOTENCE (éviter double traitement)
      if (payment.status === "success") {
        console.log("⚠️ Déjà traité");
        return;
      }

      // ✅ 4. SUCCÈS
      if (transaction.status === "approved") {
        await this.prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "success",
            rawResponse: body,
          },
        });

        await this.prisma.order.update({
          where: { id: payment.orderId },
          data: {
            status: "PAID",
            paymentStatus: "success",
          },
        });

        console.log("✅ Paiement validé:", transaction.id);
      }

      if (transaction.status === "pending") {
        await this.prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "pending",
            rawResponse: body,
          },
        });
      }

      // ❌ 5. ÉCHEC
      if (
        transaction.status === "declined" ||
        transaction.status === "canceled"
      ) {
        await this.prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "failed",
            rawResponse: body,
          },
        });

        await this.prisma.order.update({
          where: { id: payment.orderId },
          data: {
            status: "FAILED",
            paymentStatus: "failed",
          },
        });

        console.log("❌ Paiement échoué:", transaction.id);
      }

    } catch (error) {
      console.error("🔥 Webhook error:", error);
    }
  }
}


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