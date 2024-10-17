import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PackageStatistics } from '../../../domain/package/model/package-statistics';
import { StatisticsEnum } from '../../../common/enum/statistics.enum';
import { PackageStatisticsTodayMapper } from '../mapper/package-statistics-today.mapper';
import { PackageStatisticsTodayEntity } from '../entity/package-statistics-today.entity';

@Injectable()
export class PackageStatisticsTodayRepository {
  constructor(
    @InjectRepository(PackageStatisticsTodayEntity)
    private readonly repository: Repository<PackageStatisticsTodayEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async findPackageStatistics(
    packageIds: number[],
  ): Promise<PackageStatistics[]> {
    const statistics: PackageStatisticsTodayEntity[] = await this.repository
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
      return PackageStatisticsTodayMapper.toDomain(stat);
    });
  }

  async findVideoStatistics(videoIds: number[]) {
    const statistics: PackageStatisticsTodayEntity[] = await this.repository
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
      return PackageStatisticsTodayMapper.toDomain(stat);
    });
  }

  async countPageClick(): Promise<number> {
    const result: PackageStatisticsTodayEntity = await this.repository.findOne({
      where: { type: StatisticsEnum.PAGE },
    });

    return result?.clickCount || 0;
  }

  async updateClickCounts(clickCounts: PackageStatistics[]) {
    if (clickCounts.length <= 0) {
      console.log('not thing to update');
      return false;
    }

    await this.dataSource.transaction(async (transactionManager) => {
      for (const count of clickCounts) {
        await transactionManager
          .createQueryBuilder()
          .update(PackageStatisticsTodayEntity)
          .set({ clickCount: () => `click_count + ${count.clickCount}` })
          .where('type = :type', { type: count.type })
          .andWhere(
            '(package_id = :packageId OR (:packageId IS NULL AND package_id IS NULL))',
            { packageId: count.packageId },
          )
          .andWhere(
            '(package_media_id = :packageMediaId OR (:packageMediaId IS NULL AND package_media_id IS NULL))',
            { packageMediaId: count.packageMediaId },
          )
          .execute();
      }
    });

    return true;
  }

  async findStatisticsWithTimeRange(
    start: Date,
    end: Date,
  ): Promise<PackageStatistics[]> {
    const statistics: PackageStatisticsTodayEntity[] = await this.repository
      .createQueryBuilder()
      .select('type', 'type')
      .addSelect('package_id', 'packageId')
      .addSelect('package_media_id', 'packageMediaId')
      .addSelect('SUM(click_count)', 'clickCount')
      .where('created_at BETWEEN :start AND :end', {
        start: start,
        end: end,
      })
      .groupBy('type')
      .addGroupBy('package_id')
      .addGroupBy('package_media_id')
      .orderBy('type')
      .addOrderBy('package_id')
      .addGroupBy('package_media_id')
      .getRawMany();

    return statistics.map((stat) => {
      stat.packageId = stat.packageId ? Number(stat.packageId) : null;
      stat.packageMediaId = stat.packageMediaId
        ? Number(stat.packageMediaId)
        : null;
      stat.clickCount = Number(stat.clickCount);
      return PackageStatisticsTodayMapper.toDomain(stat);
    });
  }

  async countPageClickWithTimeRange(start: Date, end: Date) {
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
      return PackageStatisticsTodayMapper.toDomain(stat);
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

    if (statistics.length === 0) {
      return [];
    }

    return statistics.map((stat) => {
      stat.type = StatisticsEnum.VIDEO;
      stat.packageId = stat.packageId ? Number(stat.packageId) : null;
      stat.packageMediaId = stat.packageMediaId
        ? Number(stat.packageMediaId)
        : null;
      stat.clickCount = Number(stat.clickCount);
      return PackageStatisticsTodayMapper.toDomain(stat);
    });
  }

  async findAll(): Promise<PackageStatistics[]> {
    const statistics = await this.repository.find();
    return statistics.map((stat) => {
      stat.packageId = stat.packageId ? Number(stat.packageId) : null;
      stat.packageMediaId = stat.packageMediaId
        ? Number(stat.packageMediaId)
        : null;
      stat.clickCount = Number(stat.clickCount);
      return PackageStatisticsTodayMapper.toDomain(stat);
    });
  }

  async resetClickCount() {
    await this.dataSource.transaction(async (transactionManager) => {
      await transactionManager
        .createQueryBuilder()
        .update(PackageStatisticsTodayEntity)
        .set({ clickCount: 0 })
        .execute();
    });

    return true;
  }
}
