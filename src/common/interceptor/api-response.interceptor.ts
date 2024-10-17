import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, tap } from 'rxjs';
import { CommonResponse } from '../dto/common.response';
import { WinstonLoggerService } from '../logger/winston-logger.service';

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
  constructor(private readonly logger: WinstonLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    return next.handle().pipe(
      tap(() => this.logger.log(`[Success] [API] ${url} [METHOD] ${method}`)),
      map((data) => {
        const response = context.switchToHttp().getResponse();
        response.status(HttpStatus.OK);

        return new CommonResponse(HttpStatus.OK, 'OK', data);
      }),
    );
  }
}
