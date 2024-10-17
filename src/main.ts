import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import { GlobalExceptionFilter } from './common/filter/global-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonLoggerService } from './common/logger/winston-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new WinstonLoggerService(), // 새로 만든 서비스 사용
  });

  app.enableCors();
  const logger = app.get(WinstonLoggerService);
  // globalExceptionFilter 둥록
  app.useGlobalFilters(new GlobalExceptionFilter(logger));

  // swagger 설정
  const config = new DocumentBuilder()
    .setTitle('Samsung AI Life API Documentation')
    .setDescription('The API description')
    .setVersion('1.0.0')
    .addTag('api')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  const port = 8080;
  await app.listen(port, () => {
    console.log('server running with port ' + port);
  });
}

bootstrap();
