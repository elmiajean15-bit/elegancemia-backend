import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { AdminAuthModule } from './admin/auth/admin-auth.module';
import { ConfigModule } from '@nestjs/config';
// import { MailModule } from './mail.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { AdminClientModule } from './admin/client/admin-client.module';
import { ProductModule } from './admin/product/product.module';
import { PortfolioModule } from './admin/portfolio/portfolio.module';
import { PublicPortfolioModule } from './public/portfolio/portfolio.module';
import { PublicProductModule } from './public/product/product.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    AdminAuthModule,
    AdminClientModule,
    PublicProductModule,
    PublicPortfolioModule,
    ProductModule,
    PortfolioModule,
    // MailModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST, // ex: smtp.gmail.com
        port: parseInt(process.env.MAIL_PORT) || 587,
        secure: false, // true si port 465
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false, // utile en dev (optionnel)
        },
      },
      defaults: {
        from: `"Elegance Mia" <${process.env.MAIL_USER}>`,
      },
      template: {
        dir: join(process.cwd(), 'src/templates'), // dossier templates
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
