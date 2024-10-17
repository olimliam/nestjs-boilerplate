import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ProductStatisticsPastEntity } from '../entity/product-statistics-past.entity';
import { ProductStatisticsPastMapper } from '../mapper/product-statistics-past.mapper';
import { ProductStatistics } from '../../../domain/product/model/product-statistics';
import { StatisticsEnum } from '../../../common/enum/statistics.enum';
import { Builder } from 'builder-pattern';
import { format } from 'date-fns';

@Injectable()
export class ProductStatisticsPastRepository {
  constructor(
    @InjectRepository(ProductStatisticsPastEntity)
    private readonly repository: Repository<ProductStatisticsPastEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async findProductStatistics(
    productIds: number[],
  ): Promise<ProductStatistics[]> {
    const productStatistics = await this.repository
      .createQueryBuilder('stat')
      .select('stat.productId', 'productId')
      .addSelect('SUM(stat.clickCount)', 'clickCount')
      .where('stat.type = :type', { type: StatisticsEnum.PRODUCT })
      .andWhere('stat.productId IN(:...productIds)', { productIds })
      .groupBy('stat.productId')
      .getRawMany();

    return productStatistics.map((statistics) => {
      statistics.type = StatisticsEnum.PRODUCT;
      statistics.productId = Number(statistics.productId);
      statistics.clickCount = Number(statistics.clickCount);
      return ProductStatisticsPastMapper.toDomain(statistics);
    });
  }

  async findCardStatistics(videoIds: number[]): Promise<ProductStatistics[]> {
    const cardStatistics = await this.repository
      .createQueryBuilder('stat')
      .select('stat.productId', 'productId')
      .addSelect('SUM(stat.clickCount)', 'clickCount')
      .andWhere('stat.productMediaId IN(:...videoIds)', { videoIds: videoIds })
      .groupBy('stat.productId')
      .getRawMany();

    return cardStatistics.map((statistics) => {
      statistics.type = StatisticsEnum.VIDEO;
      statistics.productId = Number(statistics.productId);
      statistics.clickCount = Number(statistics.clickCount);
      return ProductStatisticsPastMapper.toDomain(statistics);
    });
  }

  async findVideoStatistics(videoIds: number[]): Promise<ProductStatistics[]> {
    const videoStatistics = await this.repository
      .createQueryBuilder('stat')
      .select('stat.product_id', 'productId')
      .addSelect('stat.product_media_id', 'productMediaId')
      .addSelect('stat.type', 'type')
      .addSelect('stat.click_count', 'clickCount')
      .where('stat.type = :type', { type: StatisticsEnum.VIDEO })
      .andWhere('stat.product_media_id IN(:...videoIds)', {
        videoIds: videoIds,
      })
      .getRawMany();

    return videoStatistics.map((statistics) => {
      statistics.productId = Number(statistics.productId);
      statistics.productMediaId = Number(statistics.productMediaId);
      statistics.clickCount = Number(statistics.clickCount);
      return ProductStatisticsPastMapper.toDomain(statistics);
    });
  }

  async countPageClick(): Promise<number> {
    const result: ProductStatisticsPastEntity = await this.repository.findOne({
      where: { type: StatisticsEnum.PAGE },
    });

    return result?.clickCount || 0;
  }

  async countPageClickWithTimeRange(start: Date, end: Date) {
    const result = await this.repository
      .createQueryBuilder('stat')
      .select('SUM(stat.clickCount)', 'clickCount')
      .where('stat.created_at BETWEEN :start AND :end', {
        start: format(start, 'yyyy-MM-dd'),
        end: format(end, 'yyyy-MM-dd'),
      })
      .getRawOne();

    return Number(result.clickCount);
  }

  async findProductStatisticsWithTimeRange(
    start: Date,
    end: Date,
  ): Promise<ProductStatistics[]> {
    const statistics = await this.repository
      .createQueryBuilder()
      .select('product_id', 'productId')
      .addSelect('SUM(click_count)', 'clickCount')
      .where('created_at BETWEEN :start AND :end', {
        start: format(start, 'yyyy-MM-dd'),
        end: format(end, 'yyyy-MM-dd'),
      })
      .andWhere('type = :type', { type: StatisticsEnum.PRODUCT })
      .groupBy('product_id')
      .getRawMany();

    return statistics.map((stat) => {
      stat.productId = Number(stat.productId);
      stat.clickCount = Number(stat.clickCount);
      return ProductStatisticsPastMapper.toDomain(stat);
    });
  }

  async findVideoStatisticsWithTimeRange(
    start: Date,
    end: Date,
  ): Promise<ProductStatistics[]> {
    const statistics = await this.repository
      .createQueryBuilder()
      .select('product_id', 'productId')
      .addSelect('product_media_id', 'productMediaId')
      .addSelect('SUM(click_count)', 'clickCount')
      .where('created_at BETWEEN TIMESTAMP(:start) AND TIMESTAMP(:end)', {
        start: format(start, 'yyyy-MM-dd'),
        end: format(end, 'yyyy-MM-dd'),
      })
      .andWhere('type = :type', { type: StatisticsEnum.VIDEO })
      .groupBy('product_id')
      .addGroupBy('product_media_id')
      .getRawMany();

    return statistics.map((stat) => {
      stat.type = StatisticsEnum.VIDEO;
      stat.productId = Number(stat.productId);
      stat.productMediaId = Number(stat.productMediaId);
      stat.clickCount = Number(stat.clickCount);
      return ProductStatisticsPastMapper.toDomain(stat);
    });
  }

  async createStatistics(
    productStatistics: ProductStatistics[],
    date: Date,
  ): Promise<boolean> {
    const entities: ProductStatisticsPastEntity[] = [];

    for (const stat of productStatistics) {
      const entity = Builder<ProductStatisticsPastEntity>()
        .productId(stat.productId || null)
        .productMediaId(stat.productMediaId || null)
        .type(stat.type)
        .clickCount(stat.clickCount)
        .createdAt(date)
        .build();

      entities.push(entity);
    }

    await this.dataSource.transaction(async (transactionManager) => {
      await transactionManager.save(ProductStatisticsPastEntity, entities);
    });

    return true;
  }
}
