// public-portfolio.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { PortfolioCategory } from '../../../generated/prisma/enums';

@Injectable()
export class PublicPortfolioService {
  constructor(private prisma: PrismaService) {}

  // 🔥 Liste publique (homepage / listing)
  async findAll(limit = 6, page = 1) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.portfolioProject.findMany({
        include: {
          images: true,
        },
        orderBy: [
          {
            featured: 'desc',
          },
        ],
        take: limit,
        skip,
      }),

      this.prisma.portfolioProject.count({
        where: { featured: true },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  // 🔥 Détail projet (slug)
  async findBySlug(id: string) {
    const data = this.prisma.portfolioProject.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    return data;
  }

  // 🔥 Projets similaires (option luxe)
  async findRelated(category: PortfolioCategory, excludeId: string) {
    return this.prisma.portfolioProject.findMany({
      where: {
        category,
        id: { not: excludeId },
      },
      take: 3,
      include: {
        images: true,
      },
    });
  }
}
