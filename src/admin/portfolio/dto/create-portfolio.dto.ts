import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PortfolioCategory } from '../../../../generated/prisma/client';

export class CreatePortfolioDto {
  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsString()
  description: string;

  @IsEnum(PortfolioCategory)
  category: PortfolioCategory;

  @IsNumber()
  year: number;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  // 🔥 ALT seulement
  @IsOptional()
  imagesAlt?: string[];
}
