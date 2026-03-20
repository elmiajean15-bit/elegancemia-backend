import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UpdateClientDto } from './dto/update-client.dto';
import { QueryClientDto } from './dto/query-client.dto';

@Injectable()
export class AdminClientService {
  constructor(private prisma: PrismaService) {}

  // 🔥 LISTE DES CLIENTS
  async findAll(query: QueryClientDto) {
    const { search = '', page = '1', limit = '10' } = query;

    const take = parseInt(limit);
    const skip = (parseInt(page) - 1) * take;

    return this.prisma.client.findMany({
      where: {
        role: 'client',
        OR: [{ name: { contains: search } }, { email: { contains: search } }],
      },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        avatar: true,
        role: true,
        isActive: true,
        password: false,
        createdAt: true,
      },
    });
  }

  // 🔥 DETAIL CLIENT
  async findOne(id: string) {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: {
        orders: true,
        customModeOrders: true,
      },
    });

    if (!client) {
      throw new NotFoundException('Client introuvable');
    }

    return client;
  }

  // 🔥 UPDATE CLIENT
  async update(id: string, data: UpdateClientDto) {
    const client = await this.findOne(id);

    if (!client) {
      throw new NotFoundException('Client introuvable');
    }

    return this.prisma.client.update({
      where: { id },
      data,
    });
  }

  // 🔥 ACTIVER / DESACTIVER
  async toggleStatus(id: string) {
    const client = await this.prisma.client.findUnique({
      where: { id },
    });

    if (!client) {
      throw new NotFoundException('Client introuvable');
    }

    return this.prisma.client.update({
      where: { id },
      data: {
        isActive: !client.isActive,
      },
    });
  }

  // 🔥 DELETE (optionnel)
  async delete(id: string) {
    await this.findOne(id);

    return this.prisma.client.delete({
      where: { id },
    });
  }
}
