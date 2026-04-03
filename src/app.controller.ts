import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getRoot(@Res() res: Response) {
    return res.status(403).send(`
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Accès interdit</title>
          <style>
            body {
              margin: 0;
              height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              background: linear-gradient(to bottom, #0f172a, #020617);
              font-family: Arial, sans-serif;
              color: white;
              text-align: center;
            }

            .container {
              background: rgba(255, 255, 255, 0.05);
              backdrop-filter: blur(10px);
              padding: 40px;
              border-radius: 16px;
              box-shadow: 0 20px 60px rgba(0,0,0,0.5);
              max-width: 400px;
            }

            h1 {
              font-size: 28px;
              margin-bottom: 10px;
              color: #f43f5e;
            }

            p {
              color: #cbd5f5;
              font-size: 14px;
              line-height: 1.6;
            }

            .badge {
              margin-top: 20px;
              font-size: 12px;
              color: #94a3b8;
            }
          </style>
        </head>

        <body>
          <div class="container">
            <h1>⛔ Accès interdit</h1>
            <p>
              Cette ressource n'est pas accessible publiquement.<br />
              Toute tentative d'accès est surveillée.
            </p>

            <div class="badge">
              © ${new Date().getFullYear()} Elegance Mia
            </div>
          </div>
        </body>
      </html>
    `);
  }
}



// import { Controller, Get } from '@nestjs/common';
// import { AppService } from './app.service';

// @Controller()
// export class AppController {
//   constructor(private readonly appService: AppService) {}

//   @Get()
//   getHello(): string {
//     return this.appService.getHello();
//   }
// }
