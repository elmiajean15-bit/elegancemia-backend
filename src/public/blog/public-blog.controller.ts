import { Controller, Get, Param, Query } from "@nestjs/common";
import { PublicBlogService } from "./public-blog.service";

@Controller("public/blog")
export class PublicBlogController {
  constructor(private service: PublicBlogService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  @Get("featured")
  featured() {
    return this.service.featured();
  }

  @Get("trending")
  trending() {
    return this.service.trending();
  }

  @Get(":slug")
  findOne(@Param("slug") slug: string) {
    return this.service.findOne(slug);
  }

  @Get(":slug/related")
  related(@Param("slug") slug: string) {
    return this.service.findOne(slug).then(post =>
      this.service.related(post.category, post.id)
    );
  }
}
