import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return 'DATABASE_URL:' + process.env.DATABASE_URL;
  }
}
