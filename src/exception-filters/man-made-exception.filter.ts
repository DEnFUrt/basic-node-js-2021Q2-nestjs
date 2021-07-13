import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { Streams } from 'src/logger/streams';
import { UtilsService } from 'src/utils/utils.service';

@Catch()
export class ManMadeExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly configService: ConfigService,
    private streams: Streams,
    private readonly utilsService: UtilsService,
  ) {}
  catch(exception: Error, host: ArgumentsHost) {
    const httpArgumentsHost = host.switchToHttp();
    const req = httpArgumentsHost.getRequest<Request>();
    const res = httpArgumentsHost.getResponse<Response>();

    const { headers, method } = req;
    const url = req ? this.utilsService.fullUrl(req) : '';
    const { message, stack } = exception;
    const stampDate = new Date().toLocaleString();

    const statusCode: number =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const textMessage = `Error: ${stampDate} -> Method: ${method}, Status: ${statusCode}, URL: ${url}, Message: ${message},\nStack: ${stack}`;
    const jsonMessage = {
      Error: stampDate,
      method,
      statusCode,
      url,
      headers,
      message,
      stack,
    };

    res.status(statusCode).json({
      timestamp: new Date().toISOString(),
      statusCode,
      message,
      path: url,
    });

    this.writeLog(jsonMessage, textMessage);
  }

  private writeLog(jsonMessage: any, textMessage: string): void {
    const NODE_ENV = this.configService.get<string>('NODE_ENV');

    this.streams.streamErrLog(`${JSON.stringify(jsonMessage)}\n`);

    if (NODE_ENV !== 'production') {
      this.streams.streamConsLog(`${textMessage}\n`);
    }
  }
}
