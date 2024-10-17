import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PackageStatisticsPastEntity } from '../entity/package-statistics-past.entity';
import { DataSource, Repository } from 'typeorm';
import { PackageStatistics } from '../../../domain/package/model/package-statistics';
import { PackageStatisticsPastMapper } from '../mapper/package-statistics-past.mapper';
import { StatisticsEnum } from '../../../common/enum/statistics.enum';
import { Builder } from 'builder-pattern';

@Injectable()
export class PackageStatisticsPastRepository {
  constructor(
    @InjectRepository(PackageStatisticsPastEntity)
    private readonly repository: Repository<PackageStatisticsPastEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async findPackageStatistics(
    packageIds: number[],
  ): Promise<PackageStatistics[]> {
    const statistics: PackageStatisticsPastEntity[] = await this.repository
      .createQueryBuilder('stat')
      .select('stat.package_id', 'packageId')
      .addSelect('stat.type', 'type')
      .addSelect('stat.click_count', 'clickCount')
      .where('stat.package_id IN (:...packageIds)', { packageIds })
      .andWhere('stat.type = :type', { type: StatisticsEnum.PACKAGE })
      .getRawMany();

    return statistics.map((stat) => {
      stat.packageId = Number(stat.packageId);
      stat.clickCount = Number(stat.clickCount);
      return PackageStatisticsPastMapper.toDomain(stat);
    });
  }

  async findVideoStatistics(videoIds: number[]) {
    const statistics: PackageStatisticsPastEntity[] = await this.repository
      .createQueryBuilder('stat')
      .select('stat.package_id', 'packageId')
      .addSelect('stat.package_media_id', 'packageMediaId')
      .addSelect('stat.type', 'type')
      .addSelect('stat.click_count', 'clickCount')
      .where('stat.package_media_id IN (:...videoIds)', { videoIds })
      .andWhere('stat.type = :type', { type: StatisticsEnum.VIDEO })
      .getRawMany();

    return statistics.map((stat) => {
      stat.packageId = Number(stat.packageId);
      stat.packageMediaId = Number(stat.packageMediaId);
      stat.clickCount = Number(stat.clickCount);
      return PackageStatisticsPastMapper.toDomain(stat);
    });
  }

  async countPageClick(): Promise<number> {
    const result: PackageStatisticsPastEntity = await this.repository.findOne({
      where: { type: StatisticsEnum.PAGE },
    });

    return result?.clickCount || 0;
  }

  async countPageClickWithTimeRange(start: Date, end: Date): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('stat')
      .select('SUM(stat.click_count)', 'clickCount')
      .where('stat.created_at BETWEEN :start AND :end', {
        start: start,
        end: end,
      })
      .getRawOne();

    return Number(result.clickCount);
  }

  async findPackageStatisticsWithTimeRange(start: Date, end: Date) {
    const statistics = await this.repository
      .createQueryBuilder()
      .select('package_id', 'packageId')
      .addSelect('SUM(click_count)', 'clickCount')
      .where('created_at BETWEEN :start AND :end', {
        start: start,
        end: end,
      })
      .andWhere('type = :type', { type: StatisticsEnum.PACKAGE })
      .groupBy('package_id')
      .getRawMany();

    return statistics.map((stat) => {
      stat.packageId = Number(stat.packageId);
      stat.clickCount = Number(stat.clickCount);
      return PackageStatisticsPastMapper.toDomain(stat);
    });
  }

  async findVideoStatisticsWithTimeRange(
    start: Date,
    end: Date,
  ): Promise<PackageStatistics[]> {
    const statistics = await this.repository
      .createQueryBuilder()
      .select('package_id', 'packageId')
      .addSelect('package_media_id', 'packageMediaId')
      .addSelect('SUM(click_count)', 'clickCount')
      .where('created_at BETWEEN :start AND :end', {
        start: start,
        end: end,
      })
      .andWhere('type = :type', { type: StatisticsEnum.VIDEO })
      .groupBy('package_id')
      .addGroupBy('package_media_id')
      .getRawMany();

    return statistics.map((stat) => {
      stat.type = StatisticsEnum.VIDEO;
      stat.packageId = Number(stat.packageId);
      stat.packageMediaId = Number(stat.packageMediaId);
      stat.clickCount = Number(stat.clickCount);
      return PackageStatisticsPastMapper.toDomain(stat);
    });
  }

  async createStatistics(
    statistics: PackageStatistics[],
    date: Date,
  ): Promise<boolean> {
    const entities: PackageStatisticsPastEntity[] = [];

    for (const stat of statistics) {
      const entity = Builder<PackageStatisticsPastEntity>()
        .packageId(stat.packageId || null)
        .packageMediaId(stat.packageMediaId || null)
        .type(stat.type)
        .clickCount(stat.clickCount)
        .createdAt(date)
        .build();

      entities.push(entity);
    }

    await this.dataSource.transaction(async (transactionManager) => {
      await transactionManager.save(PackageStatisticsPastEntity, entities);
    });

    return true;
  }
}
