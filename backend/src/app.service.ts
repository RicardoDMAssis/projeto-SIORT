import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus() {
    return { status: 'ok', service: 'SIORT API' };
  }

  getHealth() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
