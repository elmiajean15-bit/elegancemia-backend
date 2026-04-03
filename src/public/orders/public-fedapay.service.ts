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
    const transaction = await Transaction.create({
      description: `Commande ${data.orderId}`,
      amount: data.amount,
      currency: { iso: "XOF" },

      callback_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/checkout/result`,
      cancel_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/checkout/result`,

      customer: {
        firstname: data.name,
        email: data.email,
        phone_number: {
          number: data.phone.replace("+", ""), // ✅ FIX
          country: data.countryCode.toLowerCase(),
        },
      },
    });

    const tokenResponse = await transaction.generateToken();

    if (!tokenResponse || !tokenResponse.url) {
      throw new Error("URL de paiement introuvable");
    }

    return {
      paymentUrl: tokenResponse.url,
      reference: transaction.reference,
      transactionId: transaction.id,
    };

  } catch (error: any) {
    console.error("FedaPay error:", {
      message: error?.message,
    });

    throw new Error("Paiement impossible");
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