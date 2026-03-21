import { Body, Controller, Post } from '@nestjs/common';
import { CreateModeOrderDto } from './dto/create-mode-order.dto';
import { ModeOrderService } from './mode-order.service';

@Controller('mode-request')
export class ModeOrderController {
  constructor(private readonly service: ModeOrderService) {}

  @Post()
  async create(@Body() dto: CreateModeOrderDto) {
    const order = await this.service.create(dto);

    return {
      success: true,
      orderId: order.id,
    };
  }
}
