import { Controller, Get, Query } from "@nestjs/common";
import { ShippingPublicService } from "./shipping-public.service";

@Controller("public/shipping")
export class ShippingPublicController {
  constructor(private readonly service: ShippingPublicService) {}

  // 🌍 GET ALL ACTIVE
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // 🎯 FILTER BY ZONE
  @Get("zone")
  findByZone(@Query("zone") zone: "national" | "international") {
    return this.service.findByZone(zone);
  }

  // 📍 FILTER BY CITY
  @Get("city")
  findByCity(@Query("city") city: string) {
    return this.service.findByCity(city);
  }
}