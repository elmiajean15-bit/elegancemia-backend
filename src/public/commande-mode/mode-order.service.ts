import { PrismaService } from '../../database/prisma.service';
import { CreateModeOrderDto } from './dto/create-mode-order.dto';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ModeOrderService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateModeOrderDto) {
    let clientId: string | null = null;
    let guestClientId: string | null = null;

    // 🟢 CAS 1 : CREATION DE COMPTE
    if (dto.createAccount) {
      const existing = await this.prisma.client.findUnique({
        where: { email: dto.email },
      });

      let client;

      const hashedPassword = await bcrypt.hash(dto.password, 10);

      if (existing) {
        client = existing;
      } else {
        client = await this.prisma.client.create({
          data: {
            name: dto.nom,
            email: dto.email,
            password: hashedPassword, // ⚠️ hash à ajouter
            phone: dto.telephone,
            city: dto.ville,
            country: dto.pays,
          },
        });
      }

      clientId = client.id;
    } else {
      // 🔵 CAS 2 : GUEST
      const guest = await this.prisma.guestClient.create({
        data: {
          nom: dto.nom,
          email: dto.email,
          telephone: dto.telephone,
          ville: dto.ville,
          pays: dto.pays,
          source: dto.source,
        },
      });

      guestClientId = guest.id;
    }

    // 🧾 CREATION COMMANDE
    return this.prisma.customModeOrder.create({
      data: {
        clientId,
        guestClientId,

        type: dto.type,
        genre: dto.genre,
        pieces: dto.pieces,
        occasion: dto.occasion,

        style: dto.style,
        couleur: dto.couleur,
        matiere: dto.matiere,
        complexite: dto.complexite,
        inspiration: dto.inspiration,

        taille: dto.taille,
        morphologie: dto.morphologie,
        finitions: dto.finitions,
        accessoires: dto.accessoires,
        essayage: dto.essayage,

        budget: dto.budget,
        delai: dto.delai,
        livraison: dto.livraison,

        // SNAPSHOT
        nom: dto.nom,
        email: dto.email,
        telephone: dto.telephone,
        ville: dto.ville,
        pays: dto.pays,
        source: dto.source,
      },
    });
  }
}
