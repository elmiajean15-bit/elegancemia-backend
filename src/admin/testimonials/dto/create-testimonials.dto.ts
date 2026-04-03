import { IsString, IsOptional, IsBoolean } from "class-validator";

export class CreateTestimonialDto {
  @IsString()
  fullName: string;

  @IsString()
  occupation: string;

  @IsString()
  content: string;

  @IsString()
  avatar: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}