import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

import { ITaskBodyParser, IBoardBodyParser, IUserBodyParser } from '../common/interfaces';

type BodyParser = ITaskBodyParser & IBoardBodyParser & IUserBodyParser;

@Injectable()
export class UtilsService {
  constructor(private readonly configService: ConfigService) {}

  public hidePass(body: BodyParser): BodyParser {
    return body.password !== undefined ? { ...body, password: '*****' } : body;
  }

  public fullUrl(req: Request): string {
    const USE_FASTIFY = this.configService.get('USE_FASTIFY') as boolean;

    if (USE_FASTIFY) {
      const { hostname, protocol, url } = req;

      return `${protocol}://${hostname}${url}`;
    }

    const host = req.get('host') || '';
    const { protocol, originalUrl } = req;

    return `${protocol}://${host}${originalUrl}`;
  }
}
