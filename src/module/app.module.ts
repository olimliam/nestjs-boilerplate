import { Module } from '@nestjs/common';
import { AppController } from '../app.controller';
import { AppService } from '../app.service';
import { LoggerModule } from './logger.module';
import { ProductModule } from './product.module';
import { PackageModule } from './package.module';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { TypeormDbConfig } from '../common/config/typeorm.db.config';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { StatisticsScheduler } from '../scheduler/statistics.scheduler';
import { FacadeModule } from './facade.module';
import { TypeOrmConfigService } from 'src/common/config/db/typeorm.config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    ScheduleModule.forRoot(),
    LoggerModule,
    ProductModule,
    PackageModule,
    FacadeModule,
  ],
  controllers: [AppController],
  providers: [AppService, StatisticsScheduler],
})
export class AppModule {}
