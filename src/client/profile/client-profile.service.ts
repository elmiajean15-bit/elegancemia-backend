import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class ClientProfileService {
  constructor(private prisma: PrismaService) {}

  async getProfile(clientId: string) {
    return this.prisma.client.findUnique({
      where: { id: clientId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        country: true,
        gender: true,
        avatar: true,
      },
    });
  }

  async updateProfile(clientId: string, dto, files) {
    const avatar = files?.avatar?.[0];

    return this.prisma.client.update({
      where: { id: clientId },
      data: {
        ...dto,
        ...(avatar && {
          avatar: `/uploads/clients/${avatar.filename}`,
        }),
      },
    });
  }

  async updatePassword(clientId: string, dto) {
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });

    const isMatch = await bcrypt.compare(
      dto.currentPassword,
      client.password
    );

    if (!isMatch) {
      throw new BadRequestException("Mot de passe incorrect");
    }

    const hashed = await bcrypt.hash(dto.newPassword, 10);

    return this.prisma.client.update({
      where: { id: clientId },
      data: { password: hashed },
    });
  }
}