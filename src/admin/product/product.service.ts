import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import slugify from 'slugify';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Currency, ProductCategory } from '../../../generated/prisma/client';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  // ✅ CREATE
  async create(data: CreateProductDto, files: Express.Multer.File[]) {
    try {
      const slug = await this.generateUniqueSlug(data.name);

      // 🔥 IMAGES
      const images = (files || []).map((file, index) => ({
        url: `/uploads/products/${file.filename}`,
        alt: (data.imagesAlt?.[index] as string) || null,
      }));

      return await this.prisma.product.create({
        data: {
          name: data.name,
          slug,
          description: data.description,
          category: this.validateCategory(data.category),

          price: Number(data.price),
          currency: this.validateCurrency(data.currency),

          featured: Boolean(data.featured),

          stockQuantity: Number(data.stockQuantity ?? 0),
          inStock: Number(data.stockQuantity ?? 0) > 0,

          images: {
            create: images,
          },

          variants: {
            create: data.variants ? this.safeParse(data.variants) : [],
          },

          tags: {
            connectOrCreate: data.tags
              ? this.safeParse(data.tags).map((tag) => ({
                  where: { slug: tag.slug },
                  create: tag,
                }))
              : [],
          },
        },
        include: {
          images: true,
          variants: true,
          tags: true,
        },
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
    return this.prisma.product.findMany({
      include: {
        images: true,
        variants: true,
        tags: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // ✅ FIND ONE
  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        variants: true,
        tags: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Produit introuvable');
    }

    return product;
  }

  // ✅ UPDATE
  async update(
    id: string,
    data: UpdateProductDto,
    files: Express.Multer.File[],
  ) {
    await this.findOne(id);

    try {
      const slug = await this.generateUniqueSlug(data.name);

      const images = (files || []).map((file, index) => ({
        url: `/uploads/products/${file.filename}`,
        alt: (data.imagesAlt?.[index] as string) || null,
      }));

      return this.prisma.product.update({
        where: { id },
        data: {
          name: data.name,
          slug,
          description: data.description,
          category: data.category,

          price: Number(data.price),
          currency: data.currency,
          featured: Boolean(data.featured),

          stockQuantity: Number(data.stockQuantity ?? 0),
          inStock: Number(data.stockQuantity ?? 0) > 0,

          // 🔥 IMAGES RESET
          images: {
            deleteMany: {},
            create: images,
          },

          // 🔥 VARIANTS RESET
          variants: {
            deleteMany: {},
            create: data.variants ? this.safeParse(data.variants) : [],
          },

          // 🔥 TAGS RESET
          tags: {
            set: [],
            connectOrCreate: data.tags
              ? this.safeParse(data.tags).map((tag) => ({
                  where: { slug: tag.slug },
                  create: tag,
                }))
              : [],
          },
        },
        include: {
          images: true,
          variants: true,
          tags: true,
        },
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

    return this.prisma.product.delete({
      where: { id },
    });
  }

  // 🔥 SAFE PARSE (évite crash JSON)
  private safeParse(value: any) {
    try {
      return typeof value === 'string' ? JSON.parse(value) : value;
    } catch {
      throw new BadRequestException('Format JSON invalide');
    }
  }

  // 🔥 SLUG UNIQUE
  async generateUniqueSlug(name: string) {
    let slug = slugify(name, { lower: true, strict: true });
    let count = 1;

    while (true) {
      const existing = await this.prisma.product.findUnique({
        where: { slug },
      });

      if (!existing) return slug;

      slug = `${slug}-${count++}`;
    }
  }

  private validateCategory(category: string): ProductCategory {
    if (!Object.values(ProductCategory).includes(category as ProductCategory)) {
      throw new Error('Catégorie invalide');
    }
    return category as ProductCategory;
  }

  private validateCurrency(currency: string): Currency {
    if (!Object.values(Currency).includes(currency as Currency)) {
      throw new Error('Devise invalide');
    }
    return currency as Currency;
  }
}

// import { Injectable, NotFoundException } from '@nestjs/common';
// import { PrismaService } from '../../database/prisma.service';
// import slugify from 'slugify';

// @Injectable()
// export class ProductService {
//   constructor(private prisma: PrismaService) {}

//   // 🔥 UPLOAD LOCAL
//   private async saveFile(file: Express.Multer.File) {
//     return `/uploads/products/${file.filename}`;
//   }

//   // ✅ CREATE
//   async create(data: any, files: Express.Multer.File[]) {
//     try {
//       const slug = await this.generateUniqueSlug(data.name);

//       // 🔥 UPLOAD IMAGES
//       const images = (files || []).map((file, index) => ({
//         url: `/uploads/products/${file.filename}`,
//         alt: data.imagesAlt?.[index] || null,
//       }));

//       return this.prisma.product.create({
//         data: {
//           name: data.name,
//           slug,
//           description: data.description,
//           category: data.category,

//           price: Number(data.price),
//           currency: data.currency,

//           featured: data.featured === 'true' || data.featured === true,

//           stockQuantity: Number(data.stockQuantity ?? 0),
//           inStock: Number(data.stockQuantity ?? 0) > 0,

//           images: {
//             create: images,
//           },

//           variants: {
//             create: data.variants ? JSON.parse(data.variants) : [],
//           },

//           tags: {
//             connectOrCreate: data.tags
//               ? JSON.parse(data.tags).map((tag) => ({
//                   where: { slug: tag.slug },
//                   create: tag,
//                 }))
//               : [],
//           },
//         },

//         include: {
//           images: true,
//           variants: true,
//           tags: true,
//         },
//       });
//     } catch (error) {
//       if (error.code === 'P2002') {
//         throw new Error('Slug déjà utilisé');
//       }
//       throw error;
//     }
//   }

//   // ✅ FIND ALL
//   async findAll() {
//     return this.prisma.product.findMany({
//       include: {
//         images: true,
//         variants: true,
//         tags: true,
//       },
//       orderBy: {
//         createdAt: 'desc',
//       },
//     });
//   }

//   // ✅ UPDATE
//   async update(id: string, data: any, files: Express.Multer.File[]) {
//     await this.findOne(id);

//     try {
//       const slug = await this.generateUniqueSlug(data.name);

//       const images = (files || []).map((file, index) => ({
//         url: `/uploads/products/${file.filename}`,
//         alt: data.imagesAlt?.[index] || null,
//       }));

//       return this.prisma.product.update({
//         where: { id },

//         data: {
//           name: data.name,
//           slug,
//           description: data.description,
//           category: data.category,

//           price: Number(data.price),
//           currency: data.currency,

//           featured: data.featured === 'true' || data.featured === true,

//           stockQuantity: Number(data.stockQuantity),
//           inStock: Number(data.stockQuantity) > 0,

//           // 🔥 RESET IMAGES
//           images: {
//             deleteMany: {},
//             create: images,
//           },

//           variants: {
//             deleteMany: {},
//             create: data.variants ? JSON.parse(data.variants) : [],
//           },

//           tags: {
//             set: [],
//             connectOrCreate: data.tags
//               ? JSON.parse(data.tags).map((tag) => ({
//                   where: { slug: tag.slug },
//                   create: tag,
//                 }))
//               : [],
//           },
//         },

//         include: {
//           images: true,
//           variants: true,
//           tags: true,
//         },
//       });
//     } catch (error) {
//       if (error.code === 'P2002') {
//         throw new Error('Slug déjà utilisé');
//       }
//       throw error;
//     }
//   }

//   // ✅ FIND ONE
//   async findOne(id: string) {
//     const product = await this.prisma.product.findUnique({
//       where: { id },
//       include: {
//         images: true,
//         variants: true,
//         tags: true,
//       },
//     });

//     if (!product) {
//       throw new NotFoundException('Produit introuvable');
//     }

//     return product;
//   }

//   // ✅ DELETE
//   async delete(id: string) {
//     await this.findOne(id);

//     return this.prisma.product.delete({
//       where: { id },
//     });
//   }

//   async generateUniqueSlug(name: string) {
//     let slug = slugify(name, { lower: true });
//     let count = 1;

//     while (true) {
//       const existing = await this.prisma.product.findUnique({
//         where: { slug },
//       });

//       if (!existing) return slug;

//       slug = `${slug}-${count++}`;
//     }
//   }
// }

// import { Injectable, NotFoundException } from '@nestjs/common';
// import { PrismaService } from '../../database/prisma.service';
// import slugify from 'slugify';

// @Injectable()
// export class ProductService {
//   constructor(private prisma: PrismaService) {}

//   // ✅ CREATE
//   async create(data: any) {
//     try {
//       const slug = await this.generateUniqueSlug(data.name);

//       return this.prisma.product.create({
//         data: {
//           name: data.name,
//           slug: slug,
//           description: data.description,
//           category: data.category,

//           price: data.price,
//           currency: data.currency,

//           featured: data.featured ?? false,

//           stockQuantity: data.stockQuantity ?? 0,
//           inStock: (data.stockQuantity ?? 0) > 0,

//           images: {
//             create: data.images.map((img) => ({
//               url: img.url,
//               alt: img.alt,
//             })),
//           },

//           variants: {
//             create: data.variants || [],
//           },

//           tags: {
//             connectOrCreate:
//               data.tags?.map((tag) => ({
//                 where: { slug: tag.slug },
//                 create: {
//                   name: tag.name,
//                   slug: tag.slug,
//                 },
//               })) || [],
//           },
//         },

//         include: {
//           images: true,
//           variants: true,
//           tags: true,
//         },
//       });
//     } catch (error) {
//       if (error.code === 'P2002') {
//         throw new Error('Slug déjà utilisé');
//       }
//       throw error;
//     }
//   }

//   // ✅ FIND ALL
//   async findAll() {
//     return this.prisma.product.findMany({
//       include: {
//         images: true,
//         variants: true,
//         tags: true,
//       },
//       orderBy: {
//         createdAt: 'desc',
//       },
//     });
//   }

//   // ✅ FIND ONE
//   async findOne(id: string) {
//     const product = await this.prisma.product.findUnique({
//       where: { id },
//       include: {
//         images: true,
//         variants: true,
//         tags: true,
//       },
//     });

//     if (!product) {
//       throw new NotFoundException('Produit introuvable');
//     }

//     return product;
//   }

//   // ✅ UPDATE
//   async update(id: string, data: any) {
//     await this.findOne(id);

//     try {
//       const slug = await this.generateUniqueSlug(data.name);

//       return this.prisma.product.update({
//         where: { id },

//         data: {
//           name: data.name,
//           slug,
//           description: data.description,
//           category: data.category,

//           price: data.price,
//           currency: data.currency,

//           featured: data.featured,

//           stockQuantity: data.stockQuantity,
//           inStock: data.stockQuantity > 0,

//           // 🔥 IMAGES RESET
//           images: {
//             deleteMany: {},
//             create: data.images,
//           },

//           // 🔥 VARIANTS RESET
//           variants: {
//             deleteMany: {},
//             create: data.variants || [],
//           },

//           // 🔥 TAGS RESET
//           tags: {
//             set: [],
//             connectOrCreate:
//               data.tags?.map((tag) => ({
//                 where: { slug: tag.slug },
//                 create: tag,
//               })) || [],
//           },
//         },

//         include: {
//           images: true,
//           variants: true,
//           tags: true,
//         },
//       });
//     } catch (error) {
//       if (error.code === 'P2002') {
//         throw new Error('Slug déjà utilisé');
//       }
//       throw error;
//     }
//   }

//   // ✅ DELETE
//   async delete(id: string) {
//     await this.findOne(id);

//     return this.prisma.product.delete({
//       where: { id },
//     });
//   }

//   async generateUniqueSlug(name: string) {
//     let slug = slugify(name, { lower: true });
//     let count = 1;

//     while (true) {
//       const existing = await this.prisma.product.findUnique({
//         where: { slug },
//       });

//       if (!existing) return slug;

//       slug = `${slug}-${count++}`;
//     }
//   }
// }
