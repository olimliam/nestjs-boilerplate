import { Module } from '@nestjs/common';
import { WinstonLoggerService } from 'src/common/logger/winston-logger.service';

@Module({
  providers: [WinstonLoggerService],
  exports: [WinstonLoggerService],
})
export class LoggerModule {}
