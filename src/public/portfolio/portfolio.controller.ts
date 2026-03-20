// public-portfolio.controller.ts

import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryPublicPortfolioDto } from './dto/query-public-portfolio.dto';
import { PublicPortfolioService } from './portfolio.service';

@Controller('public/portfolio')
export class PublicPortfolioController {
  constructor(private readonly service: PublicPortfolioService) {}

  // 🔥 LISTE PUBLIC (homepage + page portfolio)
  @Get()
  async findAll(@Query() query: QueryPublicPortfolioDto) {
    const limit = query.limit ? Number(query.limit) : 6;
    const page = query.page ? Number(query.page) : 1;

    return this.service.findAll(limit, page);
  }

  // 🔥 DETAIL PROJET
  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    const project = await this.service.findBySlug(slug);

    if (!project) {
      return {
        message: 'Projet introuvable',
      };
    }

    const related = await this.service.findRelated(
      project.category,
      project.id,
    );

    return {
      project,
      related,
    };
  }
}
