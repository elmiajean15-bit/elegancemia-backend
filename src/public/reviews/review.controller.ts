// public-review.controller.ts

import { Controller, Get, Post, Body, Param, Options } from '@nestjs/common';

import { PublicReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller()
export class PublicReviewController {
  constructor(private readonly reviewService: PublicReviewService) {}

  // ✅ GET REVIEWS
  @Get('public/reviews/product/:productId')
  async getByProduct(@Param('productId') productId: string) {
    const data = await this.reviewService.findByProduct(productId);

    return {
      data,
    };
  }

  // ✅ CREATE REVIEW
  @Options('/public/reviews')
  options() {
    return;
  }
  @Post('/public/reviews')
  async create(@Body() data: CreateReviewDto) {
    const review = await this.reviewService.create(data);

    return {
      review,
    };
  }
}
