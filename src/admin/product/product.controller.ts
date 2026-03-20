import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductService } from './product.service';
import { AdminAuthGuard } from 'src/common/guards/admin-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UseInterceptors, UploadedFiles } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly service: ProductService) {}

  // ✅ CREATE
  @UseGuards(AdminAuthGuard)
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads/products',

        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);

          cb(null, uniqueName + extname(file.originalname));
        },
      }),

      // 🔥 ICI
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return cb(new Error('Format invalide'), false);
        }
        cb(null, true);
      },

      // 🔥 ICI
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  @Post()
  create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: CreateProductDto,
  ) {
    return this.service.create(body, files);
  }

  // ✅ GET ALL
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // ✅ GET ONE
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // ✅ UPDATE
  @UseGuards(AdminAuthGuard)
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads/products',

        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);

          cb(null, uniqueName + extname(file.originalname));
        },
      }),

      // 🔥 ICI
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return cb(new Error('Format invalide'), false);
        }
        cb(null, true);
      },

      // 🔥 ICI
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  @Patch(':id')
  update(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: UpdateProductDto,
  ) {
    return this.service.update(id, body, files);
  }

  // ✅ DELETE
  @UseGuards(AdminAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
