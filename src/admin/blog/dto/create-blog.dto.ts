import { IsString, IsEnum, IsBoolean, IsOptional } from "class-validator";
import { BlogCategory } from "generated/prisma/enums";

export class CreateBlogDto {
  @IsString()
  title: string;

  @IsString()
  excerpt: string;

  @IsString()
  content: string;

  @IsEnum(BlogCategory)
  category: BlogCategory;

  @IsString()
  coverUrl: string;

  @IsString()
  coverAlt: string;

  @IsString()
  authorName: string;

  @IsString()
  authorAvatar: string;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;
}