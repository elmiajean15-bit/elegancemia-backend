import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateShippingDto } from "./dto/create-shipping.dto";
import { UpdateShippingDto } from "./dto/update-shipping.dto";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class AdminShippingService {
  constructor(private prisma: PrismaService) {}

  // ✅ CREATE
  async create(data: CreateShippingDto) {
    return this.prisma.shippingMethod.create({
      data: {
        ...data,
        city: data.city ?? ""
      }
    });
  }

  // ✅ GET ALL (ADMIN)
  async findAll() {
    return this.prisma.shippingMethod.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  // ✅ GET ACTIVE (FRONTEND)
  async findActive() {
    return this.prisma.shippingMethod.findMany({
      where: { active: true },
      orderBy: { price: "asc" },
    });
  }

  // ✅ GET ONE
  async findOne(id: string) {
    const shipping = await this.prisma.shippingMethod.findUnique({
      where: { id },
    });

    if (!shipping) {
      throw new NotFoundException("Méthode de livraison introuvable");
    }

    return shipping;
  }

  // ✅ UPDATE
  async update(id: string, data: UpdateShippingDto) {
    await this.findOne(id);

    return this.prisma.shippingMethod.update({
      where: { id },
      data,
    });
  }

  // ✅ DELETE
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.shippingMethod.delete({
      where: { id },
    });
  }
}