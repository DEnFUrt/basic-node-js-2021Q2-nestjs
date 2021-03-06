import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import type { FastifyRequest } from 'fastify';
import { ConfigService } from '@nestjs/config';

import { ITaskBodyParser, IBoardBodyParser, IUserBodyParser } from '../common/interfaces';

type BodyParser = ITaskBodyParser & IBoardBodyParser & IUserBodyParser;

@Injectable()
export class UtilsService {
  constructor(private readonly configService: ConfigService) {}

  public hidePass(body: BodyParser): BodyParser {
    const password = body !== null ? body.password : undefined;

    return password !== undefined ? { ...body, password: '*****' } : body;
  }

  public fullUrl(req: Request | FastifyRequest): string {
    const USE_FASTIFY = this.configService.get('USE_FASTIFY') === 'true' ? true : false;

    if (USE_FASTIFY) {
      const { hostname, protocol, url } = req;

      return `${protocol}://${hostname}${url}`;
    }

    const host = (req as Request).get('host') || '';
    const { protocol, originalUrl } = req as Request;

    return `${protocol}://${host}${originalUrl}`;
  }
}
