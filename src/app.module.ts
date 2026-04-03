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
import { AdminClientModule } from './admin/client/admin-client.module';
import { ProductModule } from './admin/product/product.module';
import { PortfolioModule } from './admin/portfolio/portfolio.module';
import { PublicPortfolioModule } from './public/portfolio/portfolio.module';
import { PublicProductModule } from './public/product/public-product.module';
import { PublicReviewModule } from './public/reviews/review.module';
import { ModeOrderModule } from './public/commande-mode/mode-oder.module';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { ShippingPublicModule } from './public/shipping/shipping-public.module';
import { AdminShippingModule } from './admin/shipping/shipping.module';
import { PublicOrdersModule } from './public/orders/public-orders.module';
import { AdminModeOrdersModule } from './admin/mode-order/admin-mode-orders.module';
import { ClientModeOrdersModule } from './auth/client/client-mode-orders.module';
import { ClientOrdersModule } from './client/orders/client-orders.module';
import { AdminOrdersModule } from './admin/orders/admin-orders.module';
import { ClientPaymentModule } from './client/payment/client-payment.module';
import { AdminPaymentModule } from './admin/payment/admin-payment.module';
import { AdminDashboardModule } from './admin/dashboard/admin-dashboard.module';
import { ClientDashboardModule } from './client/dashboard/client-dashboard.module';
import { PublicBlogModule } from './public/blog/public-blog.module';
import { AdminBlogModule } from './admin/blog/admin-blog.module';
import { PublicContactModule } from './public/contact/public-contact.module';
import { PublicTestimonialsModule } from './public/testimonials/public-testimonials.module';
import { AdminTestimonialsModule } from './admin/testimonials/admin-testimonials.module';
import { AdminReviewModule } from './admin/reviews/admin-review.module';
import { AdminProfileModule } from './admin/profile/admin-profile.module';
import { ClientProfileModule } from './client/profile/client-profile.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    AdminAuthModule,
    AdminClientModule,
    PublicProductModule,
    ModeOrderModule,
    PublicPortfolioModule,
    ProductModule,
    PublicReviewModule,
    PublicOrdersModule,
    PortfolioModule,
    PublicOrdersModule,
    ShippingPublicModule,
    AdminModeOrdersModule,
    ClientModeOrdersModule,
    ClientOrdersModule,
    AdminOrdersModule,
    ClientPaymentModule,
    AdminPaymentModule,
    AdminShippingModule,
    AdminDashboardModule,
    ClientDashboardModule,
    PublicBlogModule,
    AdminBlogModule,
    PublicContactModule,
    PublicTestimonialsModule,
    AdminTestimonialsModule,
    AdminReviewModule,
    AdminProfileModule,
    ClientProfileModule,
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
        dir: join(process.cwd(), 'dist/src/templates'), // dossier templates
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
