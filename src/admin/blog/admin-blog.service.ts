import { PrismaService } from "src/database/prisma.service";
import { UpdateBlogDto } from "./dto/update-blog.dto";
import { Injectable } from "@nestjs/common";
import { CreateBlogDto } from "./dto/create-blog.dto";
import slugify from "slugify";

@Injectable()
export class AdminBlogService {
  constructor(private prisma: PrismaService) {}

  private toBoolean(value: unknown): boolean {
    return value === true || value === "true";
  }

  async create(
    dto: CreateBlogDto,
    files: {
      cover?: Express.Multer.File[];
      author?: Express.Multer.File[];
    }
  ) {
    const slug = slugify(dto.title, { lower: true });

    const cover = files?.cover?.[0];
    const author = files?.author?.[0];

    return this.prisma.blogPost.create({
      data: {
        ...dto,
        slug,
        featured: this.toBoolean(dto.featured),

        coverUrl: cover
          ? `/uploads/blog/${cover.filename}`
          : "",

        authorAvatar: author
          ? `/uploads/blog/${author.filename}`
          : dto.authorAvatar || "",

        publishedAt: new Date(),
      },
    });
  }

  async findAll() {
    return this.prisma.blogPost.findMany({
      orderBy: { publishedAt: "desc" },
    });
  }

  async findOne(id: string) {
    return this.prisma.blogPost.findUnique({
      where: { id },
    });
  }

  async update(
    id: string,
    dto: UpdateBlogDto,
    files: {
      cover?: Express.Multer.File[];
      author?: Express.Multer.File[];
    }
  ) {
    const cover = files?.cover?.[0];
    const author = files?.author?.[0];

    return this.prisma.blogPost.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.featured !== undefined && {
          featured: this.toBoolean(dto.featured),
        }),

        ...(cover && {
          coverUrl: `/uploads/blog/${cover.filename}`,
        }),

        ...(author && {
          authorAvatar: `/uploads/blog/${author.filename}`,
        }),
      },
    });
  }

  async delete(id: string) {
    return this.prisma.blogPost.delete({
      where: { id },
    });
  }

  async toggleFeatured(id: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { id },
    });

    return this.prisma.blogPost.update({
      where: { id },
      data: { featured: !post?.featured },
    });
  }
}



// import { Injectable } from "@nestjs/common";
// import { PrismaService } from "src/database/prisma.service";
// import { CreateBlogDto } from "./dto/create-blog.dto";
// import { UpdateBlogDto } from "./dto/update-blog.dto";
// import slugify from "slugify";

// @Injectable()
// export class AdminBlogService {
//   constructor(private prisma: PrismaService) {}

//   async create(dto: CreateBlogDto, files: Express.Multer.File[]) {
//     const slug = slugify(dto.title, { lower: true });

//     const cover = files?.[0];

//     const toBoolean = (value: unknown): boolean => {
//       return value === true || value === "true";
//     };

//     return this.prisma.blogPost.create({
//       data: {
//         ...dto,
//         slug,
//         featured: toBoolean(dto.featured),
//         coverUrl: cover ? `/uploads/blog/${cover.filename}` : "",
//         // authorAvatar: 
//         publishedAt: new Date(),
//       },
//     });
//   }

//   async findAll() {
//     return this.prisma.blogPost.findMany({
//       orderBy: { publishedAt: "desc" },
//     });
//   }

//   async findOne(id: string) {
//     return this.prisma.blogPost.findUnique({
//       where: { id },
//     });
//   }

//   async update(
//     id: string,
//     dto: UpdateBlogDto,
//     files: Express.Multer.File[]
//   ) {
//     const cover = files?.[0];

//     return this.prisma.blogPost.update({
//       where: { id },
//       data: {
//         ...dto,
//         ...(cover && {
//           coverUrl: `/uploads/blog/${cover.filename}`,
//         }),
//       },
//     });
//   }

//   async delete(id: string) {
//     return this.prisma.blogPost.delete({
//       where: { id },
//     });
//   }

//   async toggleFeatured(id: string) {
//     const post = await this.prisma.blogPost.findUnique({
//       where: { id },
//     });

//     return this.prisma.blogPost.update({
//       where: { id },
//       data: { featured: !post?.featured },
//     });
//   }
// }