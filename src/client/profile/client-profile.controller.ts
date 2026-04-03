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

import { ClientAuthGuard } from "src/common/guards/client-auth.guard";
import { UpdateClientProfileDto } from "./dto/update-client-profile.dto";
import { UpdateClientPasswordDto } from "./dto/update-client-password.dto";
import { ClientProfileService } from "./client-profile.service";

@Controller("auth/client/profile")
export class ClientProfileController {
  constructor(private service: ClientProfileService) {}

  private static storage = diskStorage({
    destination: "./uploads/clients",
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

  @UseGuards(ClientAuthGuard)
  @Get()
  getProfile(@Req() req) {
    return this.service.getProfile(req.user.userId);
  }

  @UseGuards(ClientAuthGuard)
  @Patch()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: "avatar", maxCount: 1 }], {
      storage: ClientProfileController.storage,
      fileFilter: ClientProfileController.fileFilter,
    })
  )
  updateProfile(
    @Req() req,
    @UploadedFiles() files: { avatar?: Express.Multer.File[] },
    @Body() dto: UpdateClientProfileDto
  ) {
    return this.service.updateProfile(req.user.userId, dto, files);
  }

  @UseGuards(ClientAuthGuard)
  @Patch("password")
  updatePassword(@Req() req, @Body() dto: UpdateClientPasswordDto) {
    return this.service.updatePassword(req.user.userId, dto);
  }
}