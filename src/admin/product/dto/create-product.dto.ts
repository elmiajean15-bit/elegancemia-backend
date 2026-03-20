import { IsEnum } from 'class-validator';
import { Currency, ProductCategory } from '../../../../generated/prisma/client';

export class CreateProductDto {
  name: string;
  description: string;

  @IsEnum(ProductCategory)
  category: ProductCategory;

  price: number;
  @IsEnum(Currency)
  currency: Currency;

  featured?: boolean;
  stockQuantity?: number;

  // 🔥 ALT seulement (les fichiers viennent via @UploadedFiles)
  imagesAlt?: string[];

  variants?: {
    name: string;
    value: string;
  }[];

  tags?: {
    name: string;
    slug: string;
  }[];
}

// export class CreateProductDto {
//   name: string;
//   slug: string;
//   description: string;

//   category: string;

//   price: number;
//   currency: string;

//   featured?: boolean;

//   stockQuantity?: number;

//   images: {
//     url: string;
//     alt?: string;
//   }[];

//   variants?: {
//     name: string;
//     value: string;
//   }[];

//   tags?: {
//     name: string;
//     slug: string;
//   }[];
// }
