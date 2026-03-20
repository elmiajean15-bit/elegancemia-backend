import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AdminAuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async getAdmin(adminId: string) {
    if (!adminId) {
      throw new BadRequestException('Admin ID manquant');
    }

    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!admin) {
      throw new NotFoundException('Admin introuvable');
    }

    return { user: admin };
  }

  async login(data: any) {
    const admin = await this.prisma.admin.findFirst({
      where: {
        OR: [{ email: data.identifier }, { phone: data.identifier }],
      },
    });

    if (!admin) {
      throw new UnauthorizedException('Admin introuvable');
    }

    const match = await bcrypt.compare(data.password, admin.password);

    if (!match) {
      throw new UnauthorizedException('Mot de passe incorrect');
    }

    const token = this.jwtService.sign({
      userId: admin.id,
    });

    return { token, admin };
  }

  async resetPasswordRequest(email: string) {
    const admin = await this.prisma.admin.findUnique({ where: { email } });
    if (!admin) throw new NotFoundException('Admin non trouvé');

    const token = this.jwtService.sign(
      { userId: admin.id, role: 'admin', type: 'reset', jti: uuidv4() },
      { secret: process.env.ADMIN_JWT_SECRET, expiresIn: '15m' },
    );

    console.log(token);

    const resetLink = `http://localhost:3001/super-level-mode/reinitialiser-mot-de-passe?token=${token}`;

    await this.mailerService.sendMail({
      to: admin.email,
      subject: 'Réinitialisation de votre mot de passe Admin',
      template: 'reset-password',
      context: { name: admin.name, resetLink: resetLink },
      // html: resetPasswordTemplate(admin.name, resetLink),
    });

    return { message: 'Email de réinitialisation envoyé !' };
  }

  async resetPasswordConfirm(token: string, newPassword: string) {
    let payload: any;
    try {
      payload = this.jwtService.verify(token, {
        secret: process.env.ADMIN_JWT_SECRET,
      });
    } catch {
      throw new BadRequestException('Token invalide ou expiré');
    }

    const admin = await this.prisma.admin.findUnique({
      where: { id: payload.userId },
    });
    if (!admin) throw new NotFoundException('Admin non trouvé');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.admin.update({
      where: { id: admin.id },
      data: { password: hashedPassword },
    });

    return { message: 'Mot de passe réinitialisé avec succès' };
  }

  async logout(token: string) {
    if (!token) {
      throw new UnauthorizedException('Token manquant');
    }

    let payload: any;

    try {
      payload = this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Token invalide ou expiré');
    }

    // 🔥 Vérifier si déjà blacklisté
    const existing = await this.prisma.blacklistedToken.findFirst({
      where: { token },
    });

    if (existing) {
      return { message: 'Déjà déconnecté' };
    }

    // 🔥 Ajouter blacklist
    await this.prisma.blacklistedToken.create({
      data: {
        token,
        userId: payload.userId,
        role: payload.role,
        expiresAt: new Date(payload.exp * 1000),
      },
    });

    return { message: 'Admin déconnecté avec succès' };
  }
}
