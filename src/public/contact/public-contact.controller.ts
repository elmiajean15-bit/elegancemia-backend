import { Body, Controller, Post } from "@nestjs/common";
import { PublicContactService } from "./public-contact.service";
import { CreateContactDto } from "./dto/create-contact.dto";

@Controller("public/contact")
export class PublicContactController {
  constructor(private readonly contactService: PublicContactService) {}

  @Post()
  async create(@Body() dto: CreateContactDto) {
    return this.contactService.create(dto);
  }
}