import { Module } from "@nestjs/common";
import { AdminReviewController } from "./admin-review.controller";
import { AdminReviewService } from "./admin-review.service";
import { PrismaService } from "src/database/prisma.service";

@Module({
  controllers: [AdminReviewController],
  providers: [AdminReviewService, PrismaService],
})
export class AdminReviewModule {}