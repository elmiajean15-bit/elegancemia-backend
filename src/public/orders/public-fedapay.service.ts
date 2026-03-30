import { Injectable } from "@nestjs/common";
import { FedaPay, Transaction } from "fedapay";

@Injectable()
export class PublicFedapayService {
  constructor() {
    FedaPay.setApiKey(process.env.FEDAPAY_API_KEY);
    FedaPay.setEnvironment(
      process.env.FEDAPAY_ENV === "live" ? "live" : "sandbox"
    );
  }

  async createTransaction(data: {
    amount: number;
    email?: string;
    name: string;
    phone: string;
    orderId: string;
    countryCode: string;
  }) {
    try {
      // ✅ 1. CREATE TRANSACTION
      const transaction = await Transaction.create({
        description: `Commande ${data.orderId}`,
        amount: data.amount,
        currency: { iso: "XOF" },

        callback_url: `${process.env.FRONTEND_URL}/checkout/success`,
        cancel_url: `${process.env.FRONTEND_URL}/checkout/error`,

        customer: {
          firstname: data.name,
          email: data.email,
          phone_number: {
            number: data.phone,
            country: data.countryCode.toLowerCase(),
          },
        },
      });

      // ✅ 2. GENERATE TOKEN (OBLIGATOIRE)
      const tokenResponse = await transaction.generateToken();

      const paymentUrl = tokenResponse.url;

      return {
        paymentUrl,
        reference: transaction.reference,
        transactionId: transaction.id,
      };

    } catch (error) {
      console.error("FedaPay error:", error);
      throw error;
    }
  }
}

// // fedapay.service.ts
// import { Injectable } from "@nestjs/common";
// import { FedaPay } from "fedapay";

// @Injectable()
// export class PublicFedapayService {
//   constructor() {
//     FedaPay.setApiKey(process.env.FEDAPAY_API_KEY);
//     FedaPay.setEnvironment(
//       process.env.FEDAPAY_ENV === "live" ? "live" : "sandbox"
//     );
//   }

//   async createTransaction(order: any) {
//     const transaction = await FedaPay.Transaction.create({
//       description: `Commande ${order.id}`,
//       amount: order.total,
//       currency: { iso: "XOF" },

//       callback_url: `${process.env.FRONTEND_URL}/checkout/success`,
//       cancel_url: `${process.env.FRONTEND_URL}/checkout/error`,

//       customer: {
//         firstname: order.fullName,
//         lastname: "",
//         email: order.email,
//         phone_number: {
//           number: order.phone,
//           country: "BJ",
//         },
//       },
//     });

//     const token = await transaction.generateToken();

//     return {
//       transactionId: transaction.id,
//       paymentUrl: `https://checkout.fedapay.com/${token.token}`,
//     };
//   }
// }