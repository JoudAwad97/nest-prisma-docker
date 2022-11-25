import { Controller, Get } from '@nestjs/common';
// import { User } from '@prisma/client';
import { AppService } from './app.service';
import { PrismaService } from './services/prisma/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get()
  async getHello(): Promise<string> {
    const random = Math.floor(Math.random() * 10e7);
    return 'Hello World ' + process.env.DATABASE_URL;
  }
}
