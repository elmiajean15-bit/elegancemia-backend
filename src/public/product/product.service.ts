// product.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Prisma } from '../../../generated/prisma/client';

@Injectable()
export class PublicProductService {
  constructor(private prisma: PrismaService) {}

  // ✅ GET ALL (avec filtres)
  async findAll(query: {
    search?: string;
    category?: string;
    sort?: string;
    page?: string;
    limit?: string;
  }) {
    const {
      search,
      category,
      sort = 'newest',
      page = '1',
      limit = '12',
    } = query;

    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    const where: any = {
      ...(category && category !== 'all' ? { category } : {}),

      ...(search
        ? {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          }
        : {}),
    };

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      sort === 'price-asc'
        ? { price: 'asc' }
        : sort === 'price-desc'
          ? { price: 'desc' }
          : { createdAt: 'desc' };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          images: true,
          variants: true,
          tags: true,
        },
      }),

      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page: Number(page),
        lastPage: Math.ceil(total / take),
      },
    };
  }

  // ✅ GET FEATURED (pour homepage)
  async findFeatured(limit = 3) {
    return this.prisma.product.findMany({
      where: {
        featured: true,
      },
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        images: true,
      },
    });
  }

  // ✅ GET ONE (par id)
  async findOneById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        variants: true,
        tags: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Produit introuvable');
    }

    return product;
  }
}
