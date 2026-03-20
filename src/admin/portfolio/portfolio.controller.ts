import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Patch,
  UseGuards,
  Body,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';

import { PortfolioService } from './portfolio.service';
import { AdminAuthGuard } from 'src/common/guards/admin-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';
import { extname } from 'path';

import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly service: PortfolioService) {}

  // ✅ CREATE
  @UseGuards(AdminAuthGuard)
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads/portfolio',
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);

          cb(null, uniqueName + extname(file.originalname));
        },
      }),

      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return cb(new Error('Format invalide'), false);
        }
        cb(null, true);
      },

      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  @Post()
  create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: CreatePortfolioDto,
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
        destination: './uploads/portfolio',
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);

          cb(null, uniqueName + extname(file.originalname));
        },
      }),

      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return cb(new Error('Format invalide'), false);
        }
        cb(null, true);
      },

      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  @Patch(':id')
  update(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: UpdatePortfolioDto,
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

// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Param,
//   Delete,
//   Patch,
//   UseGuards,
// } from '@nestjs/common';
// import { PortfolioService } from './portfolio.service';
// import { AdminAuthGuard } from 'src/common/guards/admin-auth.guard';

// @Controller('portfolio')
// export class PortfolioController {
//   constructor(private readonly service: PortfolioService) {}

//   @UseGuards(AdminAuthGuard)
//   @Post()
//   create(@Body() body) {
//     return this.service.create(body);
//   }

//   @Get()
//   findAll() {
//     return this.service.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.service.findOne(id);
//   }

//   @UseGuards(AdminAuthGuard)
//   @Patch(':id')
//   update(@Param('id') id: string, @Body() body) {
//     return this.service.update(id, body);
//   }

//   @UseGuards(AdminAuthGuard)
//   @Delete(':id')
//   delete(@Param('id') id: string) {
//     return this.service.delete(id);
//   }
// }
