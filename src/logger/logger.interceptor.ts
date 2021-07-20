import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { ConfigService } from '@nestjs/config';
import { Streams } from './streams';
import { UtilsService } from 'src/utils/utils.service';
import { IJsonMessage } from 'src/common/interfaces';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly configService: ConfigService,
    private streams: Streams,
    private readonly utilsService: UtilsService,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpArgumentsHost = context.switchToHttp();
    const req: Request | FastifyRequest = httpArgumentsHost.getRequest();
    const res: Response | FastifyReply = httpArgumentsHost.getResponse();

    const { method, query, body } = req;

    const url = this.utilsService.fullUrl(req);
    const startTime = Date.now();
    const permittedBody = this.utilsService.hidePass(body);

    return next.handle().pipe(
      tap((): void => {
        const ms = Date.now() - startTime;
        const { statusCode } = res;
        const stampDate = new Date().toLocaleString();

        const textMessage = `Info: ${stampDate} -> ${method}, ${statusCode} url: ${url}, query: ${JSON.stringify(
          query,
        )}, body: ${JSON.stringify(permittedBody)} - [${ms} ms.]`;

        const jsonMessage = {
          Info: stampDate,
          method,
          statusCode,
          url,
          query,
          body: permittedBody,
          ms,
        };

        this.writeLog(jsonMessage, textMessage);
      }),
    );
  }

  private writeLog(jsonMessage: IJsonMessage, textMessage: string): void {
    const NODE_ENV = this.configService.get<string>('NODE_ENV');

    this.streams.streamInfoLog(`${JSON.stringify(jsonMessage)}\n`);

    if (NODE_ENV !== 'production') {
      this.streams.streamConsLog(`${textMessage}\n`);
    }
  }
}
