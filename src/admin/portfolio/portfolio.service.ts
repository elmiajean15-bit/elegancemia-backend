import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import slugify from 'slugify';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';

@Injectable()
export class PortfolioService {
  constructor(private prisma: PrismaService) {}

  // ✅ CREATE
  async create(data: CreatePortfolioDto, files: Express.Multer.File[]) {
    try {
      const slug = await this.generateUniqueSlug(data.slug || data.title);

      // 🔥 IMAGES
      const images = (files || []).map((file, index) => ({
        url: `/uploads/portfolio/${file.filename}`,
        alt: data.imagesAlt?.[index] || '',
      }));

      return await this.prisma.portfolioProject.create({
        data: {
          title: data.title,
          slug,
          description: data.description,
          category: data.category,
          year: Number(data.year),
          featured: Boolean(data.featured),

          images: {
            create: images,
          },
        },
        include: { images: true },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Slug déjà utilisé');
      }
      throw error;
    }
  }

  // ✅ FIND ALL
  async findAll() {
    console.log('ok');

    return this.prisma.portfolioProject.findMany({
      include: { images: true },
      orderBy: { year: 'desc' },
    });
  }

  // ✅ FIND ONE
  async findOne(id: string) {
    const project = await this.prisma.portfolioProject.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!project) {
      throw new NotFoundException('Projet introuvable');
    }

    return project;
  }

  // ✅ UPDATE
  async update(
    id: string,
    data: UpdatePortfolioDto,
    files: Express.Multer.File[],
  ) {
    await this.findOne(id);

    try {
      const slug = await this.generateUniqueSlug(data.slug || data.title);

      const images = (files || []).map((file, index) => ({
        url: `/uploads/portfolio/${file.filename}`,
        alt: data.imagesAlt?.[index] || '',
      }));

      return this.prisma.portfolioProject.update({
        where: { id },
        data: {
          title: data.title,
          slug,
          description: data.description,
          category: data.category,
          year: Number(data.year),
          featured: Boolean(data.featured),

          images: {
            deleteMany: {},
            create: images,
          },
        },
        include: { images: true },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Slug déjà utilisé');
      }
      throw error;
    }
  }

  // ✅ DELETE
  async delete(id: string) {
    await this.findOne(id);

    return this.prisma.portfolioProject.delete({
      where: { id },
    });
  }

  // 🔥 SLUG UNIQUE
  async generateUniqueSlug(name: string) {
    let slug = slugify(name, { lower: true, strict: true });
    let count = 1;

    while (true) {
      const existing = await this.prisma.portfolioProject.findUnique({
        where: { slug },
      });

      if (!existing) return slug;

      slug = `${slug}-${count++}`;
    }
  }
}

// import { Injectable, NotFoundException } from '@nestjs/common';
// import { PrismaService } from '../../database/prisma.service';

// @Injectable()
// export class PortfolioService {
//   constructor(private prisma: PrismaService) {}

//   async create(data: any) {
//     return this.prisma.portfolioProject.create({
//       data: {
//         title: data.title,
//         slug: data.slug,
//         description: data.description,
//         category: data.category,
//         year: data.year,
//         featured: data.featured,
//         images: {
//           create: data.images.map((img) => ({
//             url: img.url,
//             alt: img.alt,
//           })),
//         },
//       },
//       include: { images: true },
//     });
//   }

//   async findAll() {
//     return this.prisma.portfolioProject.findMany({
//       include: { images: true },
//       orderBy: { year: 'desc' },
//     });
//   }

//   async findOne(id: string) {
//     const project = await this.prisma.portfolioProject.findUnique({
//       where: { id },
//       include: { images: true },
//     });

//     if (!project) throw new NotFoundException('Projet introuvable');

//     return project;
//   }

//   async update(id: string, data: any) {
//     return this.prisma.portfolioProject.update({
//       where: { id },
//       data: {
//         title: data.title,
//         description: data.description,
//         category: data.category,
//         year: data.year,
//         featured: data.featured,

//         images: {
//           deleteMany: {},
//           create: data.images,
//         },
//       },
//       include: { images: true },
//     });
//   }

//   async delete(id: string) {
//     return this.prisma.portfolioProject.delete({
//       where: { id },
//     });
//   }
// }
