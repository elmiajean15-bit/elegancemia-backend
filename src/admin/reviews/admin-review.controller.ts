import {
  Controller,
  Get,
  Param,
  Patch,
  Delete,
} from "@nestjs/common";

import { AdminReviewService } from "./admin-review.service";

@Controller("admin/reviews")
export class AdminReviewController {
  constructor(private readonly service: AdminReviewService) {}

  // 📋 LISTE
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // 🔍 DETAIL
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  // ✅ TOGGLE VERIFIED
  @Patch(":id/toggle")
  toggle(@Param("id") id: string) {
    return this.service.toggleVerified(id);
  }

  // 🗑️ DELETE
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}