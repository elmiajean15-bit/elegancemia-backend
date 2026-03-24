import * as bcrypt from 'bcrypt';
import { AdminRole, PrismaClient } from '../../generated/prisma/client';
import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

function getDbConfigFromUrl() {
 const raw = process.env.DATABASE_URL;
 if (!raw) throw new Error('DATABASE_URL is not set');

 const u = new URL(raw);
 return {
 host: u.hostname,
 port: u.port ? Number(u.port) : 3306,
 user: decodeURIComponent(u.username),
 password: decodeURIComponent(u.password),
 database: u.pathname.replace(/^\//, ''),
 };
}

const adapter = new PrismaMariaDb({
 ...getDbConfigFromUrl(),
 connectionLimit: 5,
});

export const prisma = new PrismaClient({ adapter });

async function main() {
 const password = await bcrypt.hash('Telma15$.', 10);

 const admin = await prisma.admin.create({
 data: {
 name: 'Elegance Mia',
 email: 'elegancemia11@gmail.com',
 phone: '2290161584504',
 password,
 role: AdminRole.super_admin,
 },
 });

 console.log('Admin créé :', admin);
}

main()
 .catch(console.error)
 .finally(() => prisma.$disconnect());



// import * as bcrypt from 'bcrypt';
// import { AdminRole, PrismaClient } from '../../generated/prisma/client';
// import 'dotenv/config';
// import { PrismaMariaDb } from '@prisma/adapter-mariadb';

// const adapter = new PrismaMariaDb({
//   host: process.env.DB_HOST,
//   port: Number(process.env.DB_PORT),
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
//   connectionLimit: 5,
// });

// export const prisma = new PrismaClient({ adapter });

// async function main() {
//   const password = await bcrypt.hash('mancreator_06', 10);

//   const admin = await prisma.admin.create({
//     data: {
//       name: 'Mancreator Admin',
//       email: 'mancreator06@gmail.com',
//       phone: '2290197329640',
//       password: password,
//       role: AdminRole.super_admin,
//     },
//   });

//   console.log('Admin créé :', admin);
// }

// main()
//   .catch(console.error)
//   .finally(() => prisma.$disconnect());

// //   npx ts-node prisma/seed/create-admin.ts
