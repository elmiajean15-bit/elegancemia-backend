import { Injectable } from "@nestjs/common";
import { BlogCategory } from "generated/prisma/enums";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class PublicBlogService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any) {
    const { category, search, page = 1 } = query;

    const where: any = {};

    if (category && category !== "all") {
      where.category = category;
    }

    if (search) {
      where.title = {
        contains: search,
      };
    }

    const perPage = 6;

    const [data, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where,
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { publishedAt: "desc" },
      }),
      this.prisma.blogPost.count({ where }),
    ]);

    return {
      data,
      totalPages: Math.ceil(total / perPage),
    };
  }

  async findOne(slug: string) {
    return this.prisma.blogPost.findUnique({
      where: { slug: slug },
    });
  }

  async featured() {
    return this.prisma.blogPost.findFirst({
      where: { featured: true },
    });
  }

  async trending() {
    return this.prisma.blogPost.findMany({
      take: 3,
      orderBy: { publishedAt: "desc" },
    });
  }

  async related(category: BlogCategory, id: string) {
    return this.prisma.blogPost.findMany({
      where: {
        category,
        NOT: { id },
      },
      take: 3,
    });
  }
}