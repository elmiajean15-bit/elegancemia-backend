import { Controller, Get } from "@nestjs/common";
import { PublicTestimonialsService } from "./public-testimonials.service";

@Controller("public/testimonials")
export class PublicTestimonialsController {
  constructor(private readonly service: PublicTestimonialsService) {}

  @Get()
  async getAll() {
    return this.service.findAll();
  }
}