import { HttpStatus } from '@nestjs/common';
import { ErrorEnum } from './error.enum';

interface ErrorResponse {
  message: string;
  statusCode: HttpStatus;
}

export const CUSTOM_RESPONSE: Record<ErrorEnum, ErrorResponse> = {
  [ErrorEnum.BAD_REQUEST]: {
    message: '유효하지 않은 파라미터를 사용한 요청',
    statusCode: HttpStatus.BAD_REQUEST,
  },
  [ErrorEnum.LOG_CREATE_FAILED]: {
    message: '데이터베이스에 로그 생성 실패',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  [ErrorEnum.STATISTICS_CREATE_FAILED]: {
    message: '데이터베이스에 일간 통계 생성 실패',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  [ErrorEnum.STATISTICS_COUNT_RESET_FAILED]: {
    message: '데이터베이스의 statistics_today 테이블 clickCount 초기화 실패',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
};
