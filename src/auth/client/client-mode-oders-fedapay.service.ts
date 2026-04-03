import { Injectable } from "@nestjs/common";
import { FedaPay, Transaction } from "fedapay";

@Injectable()
export class ClientModeOrdersFedapayService {
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
        const transaction = await Transaction.create({
            description: `Commande sur mesure ${data.orderId}`,
            amount: data.amount,
            currency: { iso: "XOF" },

            callback_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/dashboard/client/mode-orders/result`,
            cancel_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/dashboard/client/mode-orders/result`,

            customer: {
                firstname: data.name,
                email: data.email,
                phone_number: {
                    number: data.phone.replace("+", ""),
                    country: data.countryCode.toLowerCase(),
                },
            },

            metadata: {
                orderId: data.orderId,
            },
        });

        const token = await transaction.generateToken();

        if (!token || !token.url) {
            throw new Error("URL de paiement introuvable");
        }

        return {
            paymentUrl: token.url,
            transactionId: transaction.id,
        };
    }
}