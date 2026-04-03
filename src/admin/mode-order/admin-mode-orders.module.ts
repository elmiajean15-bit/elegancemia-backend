import { Module } from "@nestjs/common";
import { AdminModeOrdersController } from "./admin-mode-orders.controller";
import { AdminModeOrdersService } from "./admin-mode-orders.service";
import { PrismaService } from "src/database/prisma.service";
import { ChatModule } from "src/chat/chat.module";

@Module({
  imports: [ChatModule],
  controllers: [AdminModeOrdersController],
  providers: [AdminModeOrdersService, PrismaService],
})
export class AdminModeOrdersModule {}