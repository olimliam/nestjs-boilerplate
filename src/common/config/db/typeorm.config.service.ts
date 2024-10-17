import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get<string>('DATASOURCE_HOST'),
      port: this.configService.get<number>('DATASOURCE_PORT'),
      username: this.configService.get<string>('DATASOURCE_USER'),
      password: this.configService.get<string>('DATASOURCE_PWD'),
      database: this.configService.get<string>('DATASOURCE_SCHEMA'),
      entities: ['dist/**/**/*.entity.{ts,js}'],
      synchronize: false,
      logging: true,
      charset: 'utf8mb4',
    };
  }
}
