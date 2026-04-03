import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { CreateContactDto } from "./dto/create-contact.dto";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class PublicContactService {
  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
  ) {}

  async create(dto: CreateContactDto) {
    // 1. Sauvegarde en base
    const contact = await this.prisma.contactMessage.create({
      data: {
        ...dto,
        subject: dto.subject,
      },
    });

    function formatSubject(subject: string) {
      switch (subject) {
        case "information":
          return "Information";
        case "commande":
          return "Commande";
        case "collaboration":
          return "Collaboration";
        case "support":
          return "Support";
        default:
          return subject;
      }
    }

    // 2. Envoi email
    await this.mailerService.sendMail({
      to: process.env.CONTACT_RECEIVER_EMAIL, // 👉 email cible
      subject: `Nouveau message - ${formatSubject(dto.subject)}`,
      template: "contact-message",
      context: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone || "Non renseigné",
        subject: formatSubject(dto.subject),
        message: dto.message,
      },
    });

    return contact;
  }
}