// public-review.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class PublicReviewService {
  constructor(private prisma: PrismaService) {}

  // ✅ CREATE REVIEW
  async create(data: CreateReviewDto) {
    // 🔥 vérifier que le produit existe
    if (!data.productId) {
      throw new Error('productId est requis');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) {
      throw new NotFoundException('Produit introuvable');
    }

    const review = await this.prisma.review.create({
      data: {
        productId: data.productId,
        name: data.name,
        comment: data.comment,
        rating: data.rating,
      },
    });

    return review;
  }

  // ✅ GET REVIEWS PAR PRODUIT
  async findByProduct(productId: string) {
    return this.prisma.review.findMany({
      where: { productId, verified: true },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getAverageRating(productId: string) {
    const result = await this.prisma.review.aggregate({
      where: { productId },
      _avg: {
        rating: true,
      },
      _count: true,
    });

    return {
      average: result._avg.rating || 0,
      total: result._count,
    };
  }
}
