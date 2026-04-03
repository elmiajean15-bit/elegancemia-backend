import { Module } from "@nestjs/common";
import { PublicTestimonialsController } from "./public-testimonials.controller";
import { PrismaService } from "src/database/prisma.service";
import { PublicTestimonialsService } from "./public-testimonials.service";

@Module({
  controllers: [PublicTestimonialsController],
  providers: [PublicTestimonialsService, PrismaService],
})
export class PublicTestimonialsModule {}