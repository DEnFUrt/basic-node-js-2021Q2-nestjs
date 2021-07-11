import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { fullUrl } from '../utils/full-url';

@Catch()
export class ManMadeExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const httpArgumentsHost = host.switchToHttp();
    const req = httpArgumentsHost.getRequest<Request>();
    const res = httpArgumentsHost.getResponse<Response>();
    const { headers } = req;
    const url = fullUrl(req);
    const { message, stack } = exception;

    const statusCode: number =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    res.status(statusCode).json({
      timestamp: new Date().toISOString(),
      statusCode,
      message,
      path: url,
    });

    Logger.debug('ErrorException');
    Logger.error('Request URL: ', url);
    Logger.error('Request headers: ', JSON.stringify(headers));
    Logger.error('Message: ', message);
    Logger.error('Stack: ', stack);
  }
}
