import { Injectable, NotFoundException, UseGuards } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { CreateTestimonialDto } from "./dto/create-testimonials.dto";
import { UpdateTestimonialDto } from "./dto/update-testimonials.dto";

@Injectable()
export class AdminTestimonialsService {
  constructor(private prisma: PrismaService) {}

  private toBoolean(value: unknown): boolean {
    return value === true || value === "true";
  }
  // ✅ CREATE
  async create(
    data: CreateTestimonialDto,
    files?: { avatar?: Express.Multer.File[] }
  ) {
    const avatarUrl = files?.avatar?.[0];

    return this.prisma.testimonial.create({
      data: {
        ...data,
        isPublished: this.toBoolean(data.isPublished),
        avatar: avatarUrl
          ? `/uploads/testimonials/${avatarUrl.filename}`
          : data.avatar || "",
      },
    });
  }

  // ✅ GET ALL
  findAll() {
    return this.prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  // ✅ GET ONE
  async findOne(id: string) {
    const testimonial = await this.prisma.testimonial.findUnique({ where: { id } });
    if (!testimonial) throw new NotFoundException("Testimonial not found");
    return testimonial;
  }

  // ✅ UPDATE
  async update(
    id: string,
    data: UpdateTestimonialDto,
    files?: { avatar?: Express.Multer.File[] }
  ) {
    const testimonial = await this.findOne(id);
    const avatarUrl = files?.avatar?.[0];

    return this.prisma.testimonial.update({
      where: { id },
      data: {
        ...data,
        ...(avatarUrl && { avatar: `/uploads/blog/${avatarUrl.filename}` }),
      },
    });
  }

  // ✅ DELETE
  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.testimonial.delete({ where: { id } });
  }
}