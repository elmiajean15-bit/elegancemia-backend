// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import * as express from 'express';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   app.enableCors({
//     origin: ['http://localhost:3001'],
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
//     allowedHeaders: 'Content-Type, Accept, Authorization',
//     credentials: true,
//   });

//   app.use('/uploads', express.static('uploads'));

//   await app.listen(process.env.PORT ?? 3000);
// }
// bootstrap();








import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  process.on('uncaughtException', e => console.error('uncaughtException', e));
  process.on('unhandledRejection', e => console.error('unhandledRejection', e));
  process.on('uncaughtException', e => console.error('uncaughtException', e));
  process.on('unhandledRejection', e => console.error('unhandledRejection', e));
  process.on('uncaughtException', e => console.error('uncaughtException', e));
  process.on('unhandledRejection', e => console.error('unhandledRejection', e));
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['https://www.elegancemia.com','https://elegancemia.com'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });

  app.use('/uploads', express.static('uploads'));
  console.log('BOOT PORT=', process.env.PORT);
  await app.listen(Number(process.env.PORT));
}
bootstrap();






















// // Très bonne question 👍
// // Pour ton projet **Elegance Mia (stylisme, modélisme, accessoiriste + boutique + gestion financière)**, il faut une **architecture backend claire et scalable** avec **séparation Client / Admin**.

// // On va structurer ton backend **NestJS** avec **Prisma** de manière professionnelle.

// // ---

// // # 🏗️ Structure complète recommandée du backend

// // ```
// // backend
// // │
// // ├── prisma
// // │   ├── schema.prisma
// // │   ├── migrations
// // │   └── seed
// // │       └── create-admin.ts
// // │
// // ├── src
// // │
// // │   ├── main.ts
// // │   ├── app.module.ts
// // │
// // │   ├── database
// // │   │   └── prisma.service.ts
// // │
// // │   ├── common
// // │   │   ├── guards
// // │   │   │   ├── client-auth.guard.ts
// // │   │   │   ├── admin-auth.guard.ts
// // │   │   │   └── roles.guard.ts
// // │   │   │
// // │   │   ├── decorators
// // │   │   │   └── roles.decorator.ts
// // │   │   │
// // │   │   └── filters
// // │   │
// // │   ├── auth
// // │   │   ├── auth.module.ts
// // │   │   ├── auth.controller.ts
// // │   │   ├── auth.service.ts
// // │   │   │
// // │   │   ├── strategies
// // │   │   │   └── jwt.strategy.ts
// // │   │   │
// // │   │   └── dto
// // │   │       ├── signup.dto.ts
// // │   │       └── login.dto.ts
// // │
// // │   ├── admin
// // │   │   │
// // │   │   ├── auth
// // │   │   │   ├── admin-auth.module.ts
// // │   │   │   ├── admin-auth.controller.ts
// // │   │   │   ├── admin-auth.service.ts
// // │   │   │   └── dto
// // │   │   │       └── admin-login.dto.ts
// // │   │   │
// // │   │   ├── dashboard
// // │   │   │   ├── admin-dashboard.controller.ts
// // │   │   │   └── admin-dashboard.service.ts
// // │   │   │
// // │   │   ├── products
// // │   │   │   ├── admin-products.controller.ts
// // │   │   │   └── admin-products.service.ts
// // │   │   │
// // │   │   ├── orders
// // │   │   │   ├── admin-orders.controller.ts
// // │   │   │   └── admin-orders.service.ts
// // │   │   │
// // │   │   └── finance
// // │   │       ├── admin-finance.controller.ts
// // │   │       └── admin-finance.service.ts
// // │
// // │   ├── clients
// // │   │   ├── clients.module.ts
// // │   │   ├── clients.controller.ts
// // │   │   └── clients.service.ts
// // │
// // │   ├── products
// // │   │   ├── products.module.ts
// // │   │   ├── products.controller.ts
// // │   │   └── products.service.ts
// // │
// // │   ├── orders
// // │   │   ├── orders.module.ts
// // │   │   ├── orders.controller.ts
// // │   │   └── orders.service.ts
// // │
// // │   ├── mode-orders
// // │   │   ├── mode-orders.module.ts
// // │   │   ├── mode-orders.controller.ts
// // │   │   └── mode-orders.service.ts
// // │
// // │   ├── payments
// // │   │   ├── payments.module.ts
// // │   │   ├── payments.controller.ts
// // │   │   └── payments.service.ts
// // │
// // │   ├── portfolio
// // │   │   ├── portfolio.module.ts
// // │   │   ├── portfolio.controller.ts
// // │   │   └── portfolio.service.ts
// // │
// // │   ├── blog
// // │   │   ├── blog.module.ts
// // │   │   ├── blog.controller.ts
// // │   │   └── blog.service.ts
// // │
// // │   └── contact
// // │       ├── contact.module.ts
// // │       ├── contact.controller.ts
// // │       └── contact.service.ts
// // │
// // └── package.json
// // ```

// // ---

// // # 🔐 Séparation des authentifications

// // ## Auth Client

// ```
// POST /auth/signup
// POST /auth/login
// ```

// Pour :

// * création de compte
// * connexion client
// * commandes
// * suivi commandes

// ---

// ## Auth Admin Elegance Mia

// ```
// POST /admin/auth/login
// ```

// Pour :

// * dashboard
// * gestion produits
// * gestion commandes
// * gestion paiements
// * gestion finance
// * gestion portfolio
// * gestion blog

// ---

// # 👤 Flow Client

// ```
// Client
//    │
// signup
//    │
// login
//    │
// JWT token
//    │
// client dashboard
//    │
// orders / mode-orders
// ```

// ---

// # 👑 Flow Admin

// ```
// Admin (créé via seed script)
//    │
// login
//    │
// JWT token
//    │
// admin dashboard
//    │
// manage products
// manage orders
// manage finance
// manage blog
// ```

// ---

// # 🧠 Avantage de cette architecture

// Elle te permettra facilement d’ajouter :

// * **statistiques financières**
// * **gestion stock**
// * **gestion clients**
// * **gestion commandes sur mesure**
// * **paiement mobile money**

// ce qui correspond parfaitement à ton projet **Elegance Mia**.

// ---

// # ⭐ Étape suivante recommandée

// La prochaine étape importante serait :

// ### sécuriser ton API avec :

// ```
// JWT Strategy
// ClientAuthGuard
// AdminAuthGuard
// RolesGuard
// ```

// pour protéger :

// ```
// /admin/*
// /client/*
// ```

// ---

// 💡 Si tu veux, je peux aussi te montrer **l’architecture complète backend + frontend de ton projet Elegance Mia (comme une vraie startup tech)**. Cela va te faire gagner énormément de temps pour la suite.

// backend
// │
// ├── prisma
// │   └── schema.prisma
// │
// ├── generated
// │   └── prisma
// │
// ├── src
// │
// │   ├── main.ts
// │   ├── app.module.ts
// │
// │   ├── database
// │   │   └── prisma.service.ts
// │
// │   ├── auth
// │   │   ├── auth.module.ts
// │   │   ├── auth.controller.ts
// │   │   ├── auth.service.ts
// │   │   └── jwt.strategy.ts
// │
// │   ├── clients
// │   │   ├── clients.module.ts
// │   │   ├── clients.controller.ts
// │   │   ├── clients.service.ts
// │   │   └── dto
// │   ├── mode-order
// │   │   ├── mode-order.module.ts
// │   │   ├── mode-order.controller.ts
// │   │   ├── mode-order.service.ts
// │   │   └── dto
// │   │
// │   ├── products
// │   │   ├── products.module.ts
// │   │   ├── products.controller.ts
// │   │   ├── products.service.ts
// │   │
// │   ├── orders
// │   │   ├── orders.module.ts
// │   │   ├── orders.controller.ts
// │   │   ├── orders.service.ts
// │
// │   ├── payments
// │   │   ├── payments.module.ts
// │   │   ├── payments.controller.ts
// │   │   ├── payments.service.ts
// │
// │   ├── blog
// │   │   ├── blog.module.ts
// │   │   ├── blog.controller.ts
// │   │   ├── blog.service.ts
// │
// │   ├── portfolio
// │   │   ├── portfolio.module.ts
// │   │   ├── portfolio.controller.ts
// │   │   ├── portfolio.service.ts
// │
// │   ├── shipping
// │   │   ├── shipping.module.ts
// │   │   ├── shipping.controller.ts
// │   │   ├── shipping.service.ts
// │
// │   └── contact
// │       ├── contact.module.ts
// │       ├── contact.controller.ts
// │       └── contact.service.ts
// │
// ├── .env
// ├── package.json
// └── tsconfig.json
