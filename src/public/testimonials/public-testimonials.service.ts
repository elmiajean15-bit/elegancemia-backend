import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class PublicTestimonialsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.testimonial.findMany({
      where: {
        isPublished: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}