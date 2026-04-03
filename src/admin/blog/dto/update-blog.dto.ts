import { IsOptional, IsString, IsEnum, IsBoolean } from "class-validator";
import { BlogCategory } from "generated/prisma/enums";

export class UpdateBlogDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsEnum(BlogCategory)
  category?: BlogCategory;

  @IsOptional()
  @IsString()
  coverUrl?: string;

  @IsOptional()
  @IsString()
  coverAlt?: string;

  @IsOptional()
  @IsString()
  authorName?: string;

  @IsOptional()
  @IsString()
  authorAvatar?: string;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;
}