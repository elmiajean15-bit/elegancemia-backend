import { Module } from "@nestjs/common";
import { AdminTestimonialsController } from "./admin-testimonials.controller";
import { AdminTestimonialsService } from "./admin-testimonials.service";
import { PrismaService } from "src/database/prisma.service";

@Module({
  controllers: [AdminTestimonialsController],
  providers: [AdminTestimonialsService, PrismaService],
})
export class AdminTestimonialsModule {}