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

import { AdminBlogService } from "./admin-blog.service";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { UpdateBlogDto } from "./dto/update-blog.dto";
import { AdminAuthGuard } from "src/common/guards/admin-auth.guard";

@Controller("admin/blog")
export class AdminBlogController {
  constructor(private service: AdminBlogService) {}

  // 🔥 CONFIG MUTTER COMMUNE
  private static storage = diskStorage({
    destination: "./uploads/blog",
    filename: (req, file, cb) => {
      const uniqueName =
        Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueName + extname(file.originalname));
    },
  });

  private static fileFilter = (req, file, cb) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
      return cb(new Error("Format invalide"), false);
    }
    cb(null, true);
  };

  private static limits = {
    fileSize: 5 * 1024 * 1024,
  };

  // ✅ CREATE
  @UseGuards(AdminAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: "cover", maxCount: 1 },
        { name: "author", maxCount: 1 },
      ],
      {
        storage: AdminBlogController.storage,
        fileFilter: AdminBlogController.fileFilter,
        limits: AdminBlogController.limits,
      }
    )
  )
  @Post()
  create(
    @UploadedFiles()
    files: {
      cover?: Express.Multer.File[];
      author?: Express.Multer.File[];
    },
    @Body() dto: CreateBlogDto
  ) {
    return this.service.create(dto, files);
  }

  // ✅ GET ALL
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // ✅ GET ONE
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  // ✅ UPDATE
  @UseGuards(AdminAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: "cover", maxCount: 1 },
        { name: "author", maxCount: 1 },
      ],
      {
        storage: AdminBlogController.storage,
        fileFilter: AdminBlogController.fileFilter,
        limits: AdminBlogController.limits,
      }
    )
  )
  @Patch(":id")
  update(
    @Param("id") id: string,
    @UploadedFiles()
    files: {
      cover?: Express.Multer.File[];
      author?: Express.Multer.File[];
    },
    @Body() dto: UpdateBlogDto
  ) {
    return this.service.update(id, dto, files);
  }

  // ✅ FEATURED
  @UseGuards(AdminAuthGuard)
  @Patch(":id/featured")
  toggle(@Param("id") id: string) {
    return this.service.toggleFeatured(id);
  }

  // ✅ DELETE
  @UseGuards(AdminAuthGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.delete(id);
  }
}


// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Param,
//   Patch,
//   Delete,
//   UseGuards,
//   UploadedFiles,
//   UseInterceptors,
// } from "@nestjs/common";

// import { diskStorage } from "multer";
// import { extname } from "path";
// import { FilesInterceptor } from "@nestjs/platform-express";

// import { AdminBlogService } from "./admin-blog.service";
// import { CreateBlogDto } from "./dto/create-blog.dto";
// import { UpdateBlogDto } from "./dto/update-blog.dto";
// import { AdminAuthGuard } from "src/common/guards/admin-auth.guard";

// @Controller("admin/blog")
// export class AdminBlogController {
//   constructor(private service: AdminBlogService) {}

//   // ✅ CREATE BLOG
//   @UseGuards(AdminAuthGuard)
//   @UseInterceptors(
//     FilesInterceptor("cover", 1, {
//       storage: diskStorage({
//         destination: "./uploads/blog",

//         filename: (req, file, cb) => {
//           const uniqueName =
//             Date.now() + "-" + Math.round(Math.random() * 1e9);

//           cb(null, uniqueName + extname(file.originalname));
//         },
//       }),

//       fileFilter: (req, file, cb) => {
//         if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
//           return cb(new Error("Format invalide"), false);
//         }
//         cb(null, true);
//       },

//       limits: {
//         fileSize: 5 * 1024 * 1024,
//       },
//     }),
//     FilesInterceptor("author", 1, {
//       storage: diskStorage({
//         destination: "./uploads/blog",

//         filename: (req, file, cb) => {
//           const uniqueName =
//             Date.now() + "-" + Math.round(Math.random() * 1e9);

//           cb(null, uniqueName + extname(file.originalname));
//         },
//       }),

//       fileFilter: (req, file, cb) => {
//         if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
//           return cb(new Error("Format invalide"), false);
//         }
//         cb(null, true);
//       },

//       limits: {
//         fileSize: 5 * 1024 * 1024,
//       },
//     })
//   )
//   @Post()
//   create(
//     @UploadedFiles() files: Express.Multer.File[],
//     @Body() dto: CreateBlogDto
//   ) {
//     return this.service.create(dto, files);
//   }

//   // ✅ GET ALL
//   @Get()
//   findAll() {
//     return this.service.findAll();
//   }

//   // ✅ GET ONE
//   @Get(":id")
//   findOne(@Param("id") id: string) {
//     return this.service.findOne(id);
//   }

//   // ✅ UPDATE
//   @UseGuards(AdminAuthGuard)
//   @UseInterceptors(
//     FilesInterceptor("cover", 1, {
//       storage: diskStorage({
//         destination: "./uploads/blog",

//         filename: (req, file, cb) => {
//           const uniqueName =
//             Date.now() + "-" + Math.round(Math.random() * 1e9);

//           cb(null, uniqueName + extname(file.originalname));
//         },
//       }),

//       fileFilter: (req, file, cb) => {
//         if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
//           return cb(new Error("Format invalide"), false);
//         }
//         cb(null, true);
//       },

//       limits: {
//         fileSize: 5 * 1024 * 1024,
//       },
//     }),
    
//     FilesInterceptor("author", 1, {
//       storage: diskStorage({
//         destination: "./uploads/blog",

//         filename: (req, file, cb) => {
//           const uniqueName =
//             Date.now() + "-" + Math.round(Math.random() * 1e9);

//           cb(null, uniqueName + extname(file.originalname));
//         },
//       }),

//       fileFilter: (req, file, cb) => {
//         if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
//           return cb(new Error("Format invalide"), false);
//         }
//         cb(null, true);
//       },

//       limits: {
//         fileSize: 5 * 1024 * 1024,
//       },
//     })
//   )
//   @Patch(":id")
//   update(
//     @Param("id") id: string,
//     @UploadedFiles() files: Express.Multer.File[],
//     @Body() dto: UpdateBlogDto
//   ) {
//     return this.service.update(id, dto, files);
//   }

//   // ✅ TOGGLE FEATURED
//   @UseGuards(AdminAuthGuard)
//   @Patch(":id/featured")
//   toggle(@Param("id") id: string) {
//     return this.service.toggleFeatured(id);
//   }

//   // ✅ DELETE
//   @UseGuards(AdminAuthGuard)
//   @Delete(":id")
//   remove(@Param("id") id: string) {
//     return this.service.delete(id);
//   }
// }