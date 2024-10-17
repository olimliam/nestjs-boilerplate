import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ProductStatisticsTodayEntity } from '../entity/product-statistics-today.entity';
import { ProductStatisticsTodayMapper } from '../mapper/product-statistics-today.mapper';
import { ProductStatistics } from '../../../domain/product/model/product-statistics';
import { StatisticsEnum } from '../../../common/enum/statistics.enum';
import { format } from 'date-fns';

@Injectable()
export class ProductStatisticsTodayRepository {
  constructor(
    @InjectRepository(ProductStatisticsTodayEntity)
    private readonly repository: Repository<ProductStatisticsTodayEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<ProductStatistics[]> {
    const statistics = await this.repository.find();

    return statistics.map((statistics) => {
      statistics.productId = statistics.productId
        ? Number(statistics.productId)
        : null;
      statistics.productMediaId = statistics.productMediaId
        ? Number(statistics.productMediaId)
        : null;
      statistics.clickCount = Number(statistics.clickCount);
      return ProductStatisticsTodayMapper.toDomain(statistics);
    });
  }

  async findProductStatistics(
    productIds: number[],
  ): Promise<ProductStatistics[]> {
    const productStatistics = await this.repository
      .createQueryBuilder('statistics')
      .select('statistics.productId', 'productId')
      .addSelect('SUM(statistics.clickCount)', 'clickCount')
      .where('statistics.type = :type', { type: StatisticsEnum.PRODUCT })
      .andWhere('statistics.productId IN(:...productIds)', { productIds })
      .groupBy('statistics.productId')
      .getRawMany();

    return productStatistics.map((statistics) => {
      statistics.type = StatisticsEnum.PRODUCT;
      statistics.productId = Number(statistics.productId);
      statistics.clickCount = Number(statistics.clickCount);
      return ProductStatisticsTodayMapper.toDomain(statistics);
    });
  }

  async findCardStatistics(videoIds: number[]): Promise<ProductStatistics[]> {
    const cardStatistics = await this.repository
      .createQueryBuilder('stat')
      .select('stat.productId', 'productId')
      .addSelect('SUM(stat.clickCount)', 'clickCount')
      .where('stat.type = :type', { type: StatisticsEnum.VIDEO })
      .andWhere('stat.productMediaId IN(:...videoIds)', { videoIds: videoIds })
      .groupBy('stat.productId')
      .getRawMany();

    return cardStatistics.map((statistics) => {
      statistics.type = StatisticsEnum.PRODUCT;
      statistics.productId = Number(statistics.productId);
      statistics.clickCount = Number(statistics.clickCount);
      return ProductStatisticsTodayMapper.toDomain(statistics);
    });
  }

  async findVideoStatistics(videoIds: number[]) {
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
      return ProductStatisticsTodayMapper.toDomain(statistics);
    });
  }

  async countPageClick(): Promise<number> {
    const result: ProductStatisticsTodayEntity = await this.repository.findOne({
      where: { type: StatisticsEnum.PAGE },
    });

    return result?.clickCount || 0;
  }

  async updateClickCounts(clickCounts: ProductStatistics[]): Promise<boolean> {
    if (clickCounts.length <= 0) {
      console.log('not thing to update');
      return false;
    }
    await this.dataSource.transaction(async (transactionManager) => {
      for (const count of clickCounts) {
        await transactionManager
          .createQueryBuilder()
          .update(ProductStatisticsTodayEntity)
          .set({ clickCount: () => `click_count + ${count.clickCount}` })
          .where('type = :type', { type: count.type })
          .andWhere(
            '(product_id = :productId OR (:productId IS NULL AND product_id IS NULL))',
            { productId: count.productId },
          )
          .andWhere(
            '(product_media_id = :productMediaId OR (:productMediaId IS NULL AND product_media_id IS NULL))',
            { productMediaId: count.productMediaId },
          )
          .execute();
      }
    });

    return true;
  }

  async countPageClickWithTimeRange(start: Date, end: Date) {
    const result = await this.repository
      .createQueryBuilder('stat')
      .select('SUM(stat.click_count)', 'clickCount')
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
        start: start,
        end: end,
      })
      .andWhere('type = :type', { type: StatisticsEnum.PRODUCT })
      .groupBy('product_id')
      .getRawMany();

    return statistics.map((stat) => {
      stat.productId = Number(stat.productId);
      stat.clickCount = Number(stat.clickCount);
      return ProductStatisticsTodayMapper.toDomain(stat);
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
      .where('created_at BETWEEN :start AND :end', {
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
      return ProductStatisticsTodayMapper.toDomain(stat);
    });
  }

  async resetClickCount(): Promise<boolean> {
    await this.dataSource.transaction(async (transactionManager) => {
      await transactionManager
        .createQueryBuilder()
        .update(ProductStatisticsTodayEntity)
        .set({ clickCount: 0 })
        .execute();
    });

    return true;
  }
}
