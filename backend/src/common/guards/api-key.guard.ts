import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const method = request.method.toUpperCase();

    if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
      return true;
    }

    const configuredKey = process.env.API_KEY?.trim();
    if (!configuredKey) {
      return true;
    }

    const providedKey = request.header('x-api-key')?.trim();
    if (!providedKey || providedKey !== configuredKey) {
      throw new UnauthorizedException('Chave de API inválida ou ausente.');
    }

    return true;
  }
}
