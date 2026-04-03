import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class AdminReviewService {
  constructor(private prisma: PrismaService) {}

  // ✅ LISTE DES AVIS (avec relations)
  async findAll() {
    return this.prisma.review.findMany({
      include: {
        product: true,
        client: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // ✅ DETAIL D'UN AVIS
  async findOne(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        product: true,
        client: true,
      },
    });

    if (!review) {
      throw new NotFoundException("Avis introuvable");
    }

    return review;
  }

  // ✅ ACTIVER / DESACTIVER
  async toggleVerified(id: string) {
    const review = await this.findOne(id);

    return this.prisma.review.update({
      where: { id },
      data: {
        verified: !review.verified,
      },
    });
  }

  // ✅ DELETE
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.review.delete({
      where: { id },
    });
  }
}