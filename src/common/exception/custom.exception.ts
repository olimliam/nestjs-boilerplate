import { HttpException } from '@nestjs/common';
import { CUSTOM_RESPONSE } from './data/error.response';
import { ErrorEnum } from './data/error.enum';

export class CustomException extends HttpException {
  constructor(errorCode: ErrorEnum) {
    const { message, statusCode } = CUSTOM_RESPONSE[errorCode];
    super(message, statusCode);
  }
}
