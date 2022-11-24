import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient<
    Prisma.PrismaClientOptions,
    'query' | 'info' | 'warn' | 'error'
  >
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger('PrismaService');

  public constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
        { emit: 'event', level: 'error' },
      ],
      errorFormat: 'colorless',
    });
  }

  public async onModuleInit() {
    this.$on('query', this.logger.log.bind(this.logger));
    this.$on('info', this.logger.log.bind(this.logger));

    this.$on('warn', (evt) => {
      this.logger.warn(evt);
    });

    this.$on('error', (evt) => {
      this.logger.error(evt);
    });

    this.logger.log('Connecting to Postgres database ...');
    await this.$connect();
    this.logger.log('Postgres database connection established');
  }

  public async onModuleDestroy() {
    await this.$disconnect();
  }
}
