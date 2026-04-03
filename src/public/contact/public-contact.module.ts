import { Module } from "@nestjs/common";
import { PublicContactController } from "./public-contact.controller";
import { PublicContactService } from "./public-contact.service";
import { PrismaService } from "src/database/prisma.service";

@Module({
  controllers: [PublicContactController],
  providers: [PublicContactService, PrismaService],
})
export class PublicContactModule {}