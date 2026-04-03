import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AdminProfileService {
  constructor(private prisma: PrismaService) {}

  async getProfile(adminId: string) {
    return this.prisma.admin.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
      },
    });
  }

  async updateProfile(
    adminId: string,
    dto,
    files: { avatar?: Express.Multer.File[] }
  ) {
    const avatar = files?.avatar?.[0];

    return this.prisma.admin.update({
      where: { id: adminId },
      data: {
        ...dto,
        ...(avatar && {
          avatar: `/uploads/admin/${avatar.filename}`,
        }),
      },
    });
  }

  async updatePassword(adminId: string, dto) {
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
    });

    const isMatch = await bcrypt.compare(
      dto.currentPassword,
      admin.password
    );

    if (!isMatch) {
      throw new BadRequestException("Mot de passe incorrect");
    }

    const hashed = await bcrypt.hash(dto.newPassword, 10);

    return this.prisma.admin.update({
      where: { id: adminId },
      data: { password: hashed },
    });
  }
}