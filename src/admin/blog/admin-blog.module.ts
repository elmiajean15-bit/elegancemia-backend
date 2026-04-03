import { Module } from "@nestjs/common";
import { AdminBlogService } from "./admin-blog.service";
import { AdminBlogController } from "./admin-blog.controller";
import { PrismaService } from "src/database/prisma.service";

@Module({
  providers: [AdminBlogService, PrismaService],
  controllers: [AdminBlogController],
})
export class AdminBlogModule {}