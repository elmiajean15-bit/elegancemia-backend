import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('ADMIN_JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    if (!payload?.userId) {
      throw new UnauthorizedException('Token invalide');
    }

    return {
      userId: payload.userId,
    };
  }
}

// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { PrismaService } from 'src/database/prisma.service';

// @Injectable()
// export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
//   constructor(
//     private prisma: PrismaService,
//     configService: ConfigService,
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: configService.get<string>('ADMIN_JWT_SECRET'),
//     });
//   }

//   async validate(payload: any) {
//     const admin = await this.prisma.admin.findUnique({
//       where: { id: payload.userId },
//     });

//     if (!admin) {
//       return null;
//     }

//     return admin;
//   }
// }
