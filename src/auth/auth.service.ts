import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { v4 as uuidv4 } from 'uuid';
import { SignupDto } from './dto/signup.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async getClient(userId: string) {
    const client = await this.prisma.client.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        city: true,
        gender: true,
        createdAt: true,
      },
    });

    if (!client) {
      throw new NotFoundException('Client introuvable');
    }

    return { user: client };
  }

  async signup(data: SignupDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const client = await this.prisma.client.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        city: data.city,
        gender: data.gender,
        password: hashedPassword,
      },
    });

    const token = this.jwtService.sign({
      userId: client.id,
      role: client.role,
    });

    return { token, client };
  }

  async login(data: LoginDto) {
    // Chercher le client par email ou téléphone
    const client = await this.prisma.client.findFirst({
      where: {
        OR: [{ email: data.identifier }, { phone: data.identifier }],
      },
    });

    if (!client) {
      throw new UnauthorizedException('Identifiant incorrect');
    }

    const passwordMatch = await bcrypt.compare(data.password, client.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Mot de passe incorrect');
    }

    const token = this.jwtService.sign({
      userId: client.id,
      role: client.role,
    });

    return { token, client };
  }

  // 1️⃣ Envoi email de réinitialisation
  async resetPasswordRequest(email: string) {
    const client = await this.prisma.client.findUnique({ where: { email } });
    if (!client) throw new NotFoundException('Client non trouvé');

    // Générer token JWT court (15min)
    const token = this.jwtService.sign(
      { userId: client.id, role: 'client', type: 'reset', jti: uuidv4() },
      { secret: process.env.JWT_SECRET, expiresIn: '15m' },
    );

    console.log(token);

    const resetLink = `http://localhost:3001/reinitialiser-mot-de-passe?token=${token}`;

    // Envoyer email
    // await this.mailerService.sendMail({
    //   to: client.email,
    //   subject: 'Réinitialisation de votre mot de passe',
    //   template: 'reset-password', // template ejs ou hbs
    //   context: { name: client.name, resetLink },
    // });

    await this.mailerService.sendMail({
      to: client.email,
      subject: 'Réinitialisation de votre mot de passe',
      template: 'reset-password', // template ejs ou hbs
      context: { name: client.name, resetLink: resetLink },
      // html: resetPasswordTemplate(client.name, resetLink),
    });

    return { message: 'Email de réinitialisation envoyé !' };
  }

  // 2️⃣ Réinitialisation via token
  async resetPasswordConfirm(token: string, newPassword: string) {
    let payload: any;
    try {
      payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch {
      throw new BadRequestException('Token invalide ou expiré');
    }

    const client = await this.prisma.client.findUnique({
      where: { id: payload.userId },
    });
    if (!client) throw new NotFoundException('Client non trouvé');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.client.update({
      where: { id: client.id },
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

    const existing = await this.prisma.blacklistedToken.findFirst({
      where: { token },
    });

    if (existing) {
      return { message: 'Déjà déconnecté' };
    }

    await this.prisma.blacklistedToken.create({
      data: {
        token,
        userId: payload.userId,
        role: payload.role || 'client',
        expiresAt: new Date(payload.exp * 1000),
      },
    });

    return { message: 'Déconnexion réussie' };
  }
}

// function resetPasswordTemplate(name: string, link: string) {
//   return `
// <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:2rem; background-color:#f9f9f9; border-radius:8px;">
//   <div style="text-align:center; margin-bottom:1rem;">
//     <h1><strong>ELEGANCE</strong> <span style="color:#E11D48;">MIA</span></h1>
//     {{!-- <img src="https://votre-site.com/logo.png" alt="Elegance Mia" width="120" /> --}}
//   </div>

//   <h2 style="color:#E11D48; text-align:center;">Réinitialisation de votre mot de passe</h2>

//   <p>Bonjour ${name},</p>

//   <p>
//     Vous avez demandé à réinitialiser votre mot de passe pour votre compte sur <strong>Elegance Mia</strong>.
//   </p>

//   <div style="text-align:center; margin:2rem 0;">
//     <a href="${link}" style="background-color:#E11D48; color:white; padding:12px 25px; border-radius:5px; text-decoration:none; font-weight:bold;">
//       Réinitialiser mon mot de passe
//     </a>
//   </div>

//   <p style="font-size:0.9rem; color:#666;">
//     Si vous n'avez pas demandé cette action, vous pouvez ignorer cet email. Ce lien expirera dans 15 minutes.
//   </p>

//   <hr style="margin:2rem 0; border-color:#eee;" />
//   <p style="font-size:0.8rem; color:#999; text-align:center;">
//     &copy; 2026 Elegance Mia. Tous droits réservés.
//   </p>
// </div>
//   `;
// }
