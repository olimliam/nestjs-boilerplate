import { LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import { Injectable } from '@nestjs/common';
import * as winstonDaily from 'winston-daily-rotate-file'; // 일별 로그 회전
import { utilities } from 'nest-winston'; // NestJS의 winston 유틸리티

import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const appendTimestamp = winston.format((info, opts) => {
  if (opts.tz) {
    info.timestamp = format(
      toZonedTime(new Date(), opts.tz),
      "yyyy-MM-dd'T'HH:mm:ssXXX",
    );
  }
  return info;
});

@Injectable()
export class WinstonLoggerService implements LoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'production' ? 'http' : 'debug',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            utilities.format.nestLike('MBTI_LENS', {
              prettyPrint: true, // 로그를 예쁘게 출력해줌
            }),
          ),
        }),
        new winston.transports.File({ filename: 'combined.log' }),
        // info, error, fatal 로그는 파일로 관리
        new winstonDaily(this.dailyOptions('info')),
        new winstonDaily(this.dailyOptions('error')),
        new winstonDaily(this.dailyOptions('fatal')),
      ],
      format: winston.format.combine(
        appendTimestamp({ tz: 'Asia/Seoul' }),
        winston.format.json(),
        winston.format.printf((info) => {
          return `${info.timestamp} - ${info.level} ${info.message}`;
        }),
      ),
    });
  }

  // 일별 로그 회전 설정 함수
  private dailyOptions(level: string) {
    return {
      level,
      datePattern: 'YYYY-MM-DD',
      dirname: `./logs/${level}`, // 로그 파일 디렉토리
      filename: `%DATE%.${level}.log`, // 로그 파일 이름
      maxFiles: 30, // 최대 파일 보관 일수
      zippedArchive: true, // 오래된 로그를 압축
      format: winston.format.combine(
        winston.format.timestamp(),
        utilities.format.nestLike(process.env.NODE_ENV, {
          colors: false,
          prettyPrint: true,
        }),
      ),
      colorize: true,
      handleExceptions: true,
      json: false,
    };
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace: string) {
    this.logger.error(`${message} -> trace: ${trace}`);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }
}
