// dto/create-review.dto.ts

import { IsString, IsInt, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  productId: string;

  @IsString()
  name: string;

  @IsString()
  comment: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}
