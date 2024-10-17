import { forwardRef, Module } from '@nestjs/common';
import { ProductController } from '../presentation/controller/product.controller';
import { StatisticsController } from '../presentation/controller/statistics.controller';
import { ProductService } from '../domain/product/product.service';
import { ProductFacade } from '../application/facade/product.facade';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '../infrastructure/product/entity/product.entity';
import { ProductLogEntity } from '../infrastructure/product/entity/product-log.entity';
import { ProductMediaEntity } from '../infrastructure/product/entity/product-media.entity';
import { ProductStatisticsPastEntity } from '../infrastructure/product/entity/product-statistics-past.entity';
import { ProductStatisticsTodayEntity } from '../infrastructure/product/entity/product-statistics-today.entity';
import { ProductRepository } from '../infrastructure/product/repository/product.repository';
import { ProductMediaRepository } from '../infrastructure/product/repository/product-media-repository.service';
import { ProductStatisticsPastRepository } from '../infrastructure/product/repository/product-statistics-past.repository';
import { ProductStatisticsTodayRepository } from '../infrastructure/product/repository/product-statistics-today.repository';
import { ProductStatisticsHelper } from '../domain/product/product-statistics.helper';
import { ProductLogRepository } from '../infrastructure/product/repository/product-log.repository';
import { FacadeModule } from './facade.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      ProductLogEntity,
      ProductMediaEntity,
      ProductStatisticsPastEntity,
      ProductStatisticsTodayEntity,
    ]),
    forwardRef(() => FacadeModule),
  ],
  controllers: [ProductController, StatisticsController],
  providers: [
    ProductFacade,
    ProductService,
    ProductRepository,
    ProductLogRepository,
    ProductMediaRepository,
    ProductStatisticsPastRepository,
    ProductStatisticsTodayRepository,
    ProductStatisticsHelper,
  ],
  exports: [ProductFacade],
})
export class ProductModule {}
