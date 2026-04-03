import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";

import { diskStorage } from "multer";
import { extname } from "path";
import { FileFieldsInterceptor } from "@nestjs/platform-express";

import { AdminTestimonialsService } from "./admin-testimonials.service";
import { CreateTestimonialDto } from "./dto/create-testimonials.dto";
import { UpdateTestimonialDto } from "./dto/update-testimonials.dto";
import { AdminAuthGuard } from "src/common/guards/admin-auth.guard";

@Controller("admin/testimonials")
export class AdminTestimonialsController {
  constructor(private readonly service: AdminTestimonialsService) {}

  // 🔥 CONFIG MUTTER POUR AVATAR
  private static storage = diskStorage({
    destination: "./uploads/testimonials",
    filename: (req, file, cb) => {
      const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueName + extname(file.originalname));
    },
  });

  private static fileFilter = (req, file, cb) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
      return cb(new Error("Format invalide"), false);
    }
    cb(null, true);
  };

  private static limits = { fileSize: 5 * 1024 * 1024 };

  // ✅ CREATE
  @UseGuards(AdminAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: "avatar", maxCount: 1 }],
      {
        storage: AdminTestimonialsController.storage,
        fileFilter: AdminTestimonialsController.fileFilter,
        limits: AdminTestimonialsController.limits,
      }
    )
  )
  @Post()
  create(
    @UploadedFiles()
    files: { avatar?: Express.Multer.File[] },
    @Body() dto: CreateTestimonialDto
  ) {
    return this.service.create(dto, files);
  }

  // ✅ GET ALL
  @UseGuards(AdminAuthGuard)
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // ✅ GET ONE
  @UseGuards(AdminAuthGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  // ✅ UPDATE
  @UseGuards(AdminAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: "avatar", maxCount: 1 }],
      {
        storage: AdminTestimonialsController.storage,
        fileFilter: AdminTestimonialsController.fileFilter,
        limits: AdminTestimonialsController.limits,
      }
    )
  )
  @Patch(":id")
  update(
    @Param("id") id: string,
    @UploadedFiles() files: { avatar?: Express.Multer.File[] },
    @Body() dto: UpdateTestimonialDto
  ) {
    return this.service.update(id, dto, files);
  }

  // ✅ DELETE
  @UseGuards(AdminAuthGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}