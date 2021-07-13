import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import { ITaskBodyParser, IBoardBodyParser, IUserBodyParser } from '../common/interfaces';

type BodyParser = ITaskBodyParser & IBoardBodyParser & IUserBodyParser;

@Injectable()
export class UtilsService {
  public hidePass(body: BodyParser): BodyParser {
    return body.password !== undefined ? { ...body, password: '*****' } : body;
  }

  public fullUrl(req: Request): string {
    const host = req.get('host') || '';
    const { protocol, originalUrl } = req;

    return `${protocol}://${host}${originalUrl}`;
  }
}
