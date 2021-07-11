import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { fullUrl } from 'src/utils/full-url';
import { hidePass, BodyParser } from 'src/utils/hide-pass';
import { ConfigService } from '@nestjs/config';
import { Streams } from './streams';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private configService: ConfigService, private streams: Streams) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpArgumentsHost = context.switchToHttp();
    const req = httpArgumentsHost.getRequest<Request>();
    const res = httpArgumentsHost.getResponse<Response>();

    const { method, query } = req;
    const body = req.body as BodyParser;
    const url = fullUrl(req);
    const startTime = Date.now();
    const permittedBody = hidePass(body);

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

  private writeLog(jsonMessage: any, textMessage: string): void {
    const NODE_ENV = this.configService.get<string>('NODE_ENV');

    this.streams.streamInfoLog(`${JSON.stringify(jsonMessage)}\n`);

    if (NODE_ENV !== 'production') {
      this.streams.streamConsLog(`${textMessage}\n`);
    }
  }
}
