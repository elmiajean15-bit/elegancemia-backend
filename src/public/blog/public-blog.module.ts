import { Module } from "@nestjs/common";
import { PublicBlogService } from "./public-blog.service";
import { PublicBlogController } from "./public-blog.controller";
import { PrismaService } from "src/database/prisma.service";

@Module({
  providers: [PublicBlogService, PrismaService],
  controllers: [PublicBlogController],
})
export class PublicBlogModule {}