// dto/create-order.dto.ts
export class CreateOrderDto {
  items: {
    productId: string;
    quantity: number;
    size?: string;
    fabric?: string;
  }[];

  shippingMethodId: string;

  paymentMethod: string;

  total: number;

  customer: {
    fullName: string;
    phone: string;
    email?: string;
    address: string;
    countryCode: string;
  };
}