import {
  Controller,
  Get,
  Patch,
  UseGuards,
  UploadedFiles,
  UseInterceptors,
  Body,
  Req,
} from "@nestjs/common";

import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";

import { AdminAuthGuard } from "src/common/guards/admin-auth.guard";
import { UpdateAdminProfileDto } from "./dto/update-admin-profile.dto";
import { UpdateAdminPasswordDto } from "./dto/update-admin-password.dto";
import { AdminProfileService } from "./admin-profile.service";

@Controller("admin/profile")
export class AdminProfileController {
  constructor(private service: AdminProfileService) {}

  // 🔥 CONFIG MULTER
  private static storage = diskStorage({
    destination: "./uploads/admin",
    filename: (req, file, cb) => {
      const name = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, name + extname(file.originalname));
    },
  });

  private static fileFilter = (req, file, cb) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
      return cb(new Error("Format invalide"), false);
    }
    cb(null, true);
  };

  
  @UseGuards(AdminAuthGuard)
  @Get()
  getProfile(@Req() req) {
    return this.service.getProfile(req.user.userId);
  }

  
  @UseGuards(AdminAuthGuard)
  @Patch()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: "avatar", maxCount: 1 }], {
      storage: AdminProfileController.storage,
      fileFilter: AdminProfileController.fileFilter,
    })
  )
  updateProfile(
    @Req() req,
    @UploadedFiles() files: { avatar?: Express.Multer.File[] },
    @Body() dto: UpdateAdminProfileDto
  ) {
    return this.service.updateProfile(req.user.userId, dto, files);
  }

  @UseGuards(AdminAuthGuard)
  @Patch("password")
  updatePassword(@Req() req, @Body() dto: UpdateAdminPasswordDto) {
    return this.service.updatePassword(req.user.userId, dto);
  }
}