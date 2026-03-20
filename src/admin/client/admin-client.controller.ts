import {
  Controller,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AdminClientService } from './admin-client.service';
import { UpdateClientDto } from './dto/update-client.dto';
import { QueryClientDto } from './dto/query-client.dto';
import { AdminAuthGuard } from 'src/common/guards/admin-auth.guard';

@Controller('admin/clients')
@UseGuards(AdminAuthGuard)
export class AdminClientController {
  constructor(private readonly service: AdminClientService) {}

  // 🔥 LISTE
  @UseGuards(AdminAuthGuard)
  @Get()
  findAll(@Query() query: QueryClientDto) {
    return this.service.findAll(query);
  }

  // 🔥 DETAIL
  @UseGuards(AdminAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // 🔥 UPDATE
  @UseGuards(AdminAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateClientDto) {
    return this.service.update(id, body);
  }

  // 🔥 ACTIVER / DESACTIVER
  @UseGuards(AdminAuthGuard)
  @Patch(':id/toggle')
  toggle(@Param('id') id: string) {
    return this.service.toggleStatus(id);
  }

  // 🔥 DELETE (optionnel)
  @UseGuards(AdminAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
