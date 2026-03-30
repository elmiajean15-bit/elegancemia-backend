import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class ShippingPublicService {
  constructor(private prisma: PrismaService) {}

  // ✅ GET ALL ACTIVE
  async findAll() {
    return this.prisma.shippingMethod.findMany({
      where: { active: true },
      orderBy: { price: "asc" },
    });
  }

  // ✅ FILTER BY ZONE (national / international)
  async findByZone(zone: "national" | "international") {
    return this.prisma.shippingMethod.findMany({
      where: {
        active: true,
        zone,
      },
      orderBy: { price: "asc" },
    });
  }

  // ✅ FILTER BY CITY (IMPORTANT POUR CHECKOUT)
  async findByCity(city: string) {
    return this.prisma.shippingMethod.findMany({
      where: {
        active: true,
        city: {
          contains: city,
        },
      },
      orderBy: { price: "asc" },
    });
  }
}