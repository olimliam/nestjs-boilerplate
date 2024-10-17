import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CommonResponse } from '../dto/common.response';
import { CustomException } from '../exception/custom.exception';

// import { CustomLoggerService } from '../logger/logger.service';
import { WinstonLoggerService } from '../logger/winston-logger.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: WinstonLoggerService) {} // winston logger 주입

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    let httpStatusCode: HttpStatus;

    if (exception instanceof CustomException) {
      httpStatusCode = exception.getStatus();

      this.logger.warn(
        `[HTTP Status] ${httpStatusCode} \n[Error Message] ${JSON.stringify(exception.getResponse())}`,
      );
    } else {
      httpStatusCode =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      const message =
        exception instanceof HttpException
          ? JSON.stringify(exception.getResponse())
          : 'Unhandled Error Occurred';

      this.logger.error(
        `[HTTP Status] ${httpStatusCode} \n[Error Message]: ${JSON.stringify(message)}\n`,
        exception instanceof Error ? exception.stack : '',
      );
    }

    const apiResponse = new CommonResponse(
      httpStatusCode,
      exception.message,
      null,
    );

    response.status(httpStatusCode).json(apiResponse);
  }
}
