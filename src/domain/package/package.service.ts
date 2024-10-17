import { Injectable } from '@nestjs/common';
import { PackageRepository } from '../../infrastructure/package/repository/package.repository';
import { Package } from './model/package';
import { PackageStatisticsPastRepository } from '../../infrastructure/package/repository/package-statistics-past.repository';
import { PackageStatisticsTodayRepository } from '../../infrastructure/package/repository/package-statistics-today.repository';
import { PackageStatisticsHelper } from './package-statistics.helper';
import { PackageMediaRepository } from '../../infrastructure/package/repository/package-media.repository';
import { PackageVideo } from './model/package-video';
import { CreateClickLogInfo } from '../../application/model/create-click-log.info';
import { PackageLogRepository } from '../../infrastructure/package/repository/package-log.repository';
import { PackageStatistics } from './model/package-statistics';

@Injectable()
export class PackageService {
  constructor(
    private readonly packageRepository: PackageRepository,
    private readonly packageMediaRepository: PackageMediaRepository,
    private readonly statisticsPastRepository: PackageStatisticsPastRepository,
    private readonly statisticsTodayRepository: PackageStatisticsTodayRepository,
    private readonly packageLogRepository: PackageLogRepository,
    private readonly statisticsHelper: PackageStatisticsHelper,
  ) {}

  async packageList(): Promise<Package[]> {
    return await this.packageRepository.findAll();
  }

  async findPackageStatistics(
    packageIds: number[],
  ): Promise<Map<number, number>> {
    const pastStatistics =
      await this.statisticsPastRepository.findPackageStatistics(packageIds);

    const todayStatistics =
      await this.statisticsTodayRepository.findPackageStatistics(packageIds);

    const clickCountMap = new Map<number, number>();
    this.statisticsHelper.addPackageClickCount(clickCountMap, pastStatistics);
    this.statisticsHelper.addPackageClickCount(clickCountMap, todayStatistics);

    return clickCountMap;
  }

  async findAllVideoList(): Promise<PackageVideo[]> {
    return await this.packageMediaRepository.findAllVideos();
  }

  async packageVideoList(packageId: number): Promise<PackageVideo[]> {
    return await this.packageMediaRepository.findPackageVideos(packageId);
  }

  async findVideoStatistics(videoIds: number[]): Promise<Map<number, number>> {
    const pastStatistics =
      await this.statisticsPastRepository.findVideoStatistics(videoIds);

    const todayStatistics =
      await this.statisticsTodayRepository.findVideoStatistics(videoIds);

    const clickCountMap = new Map<number, number>();
    this.statisticsHelper.addVideoClickCount(clickCountMap, pastStatistics);
    this.statisticsHelper.addVideoClickCount(clickCountMap, todayStatistics);

    return clickCountMap;
  }

  async countPageClick(): Promise<number> {
    const pastCount = await this.statisticsPastRepository.countPageClick();
    const todayCount = await this.statisticsTodayRepository.countPageClick();

    return pastCount + todayCount;
  }

  async createClickLog(request: CreateClickLogInfo) {
    return await this.packageLogRepository.createPackageLog(request);
  }

  async countClicksAfterGivenDate(date: Date): Promise<PackageStatistics[]> {
    return await this.packageLogRepository.countClicksAfterGivenDate(date);
  }

  async updateStatistics(clickCounts: PackageStatistics[]) {
    return await this.statisticsTodayRepository.updateClickCounts(clickCounts);
  }

  async countPageClickWithTimeRange(start: Date, end: Date): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pastStatistics =
      start < today
        ? await this.statisticsPastRepository.countPageClickWithTimeRange(
            start,
            end,
          )
        : 0;

    const todayStatistics =
      end > today
        ? await this.statisticsTodayRepository.countPageClickWithTimeRange(
            start,
            end,
          )
        : 0;

    return pastStatistics + todayStatistics;
  }

  async findPackageNameList(): Promise<
    Map<number, { name: string; description: string }>
  > {
    const packages = await this.packageRepository.findAll();

    const map = new Map<number, { name: string; description: string }>();
    packages.forEach((p) => {
      map.set(p.id, { name: p.name, description: p.description });
    });

    return map;
  }

  async findVideoNameList(): Promise<
    Map<number, { title: string; description: string }>
  > {
    const videos: PackageVideo[] =
      await this.packageMediaRepository.findAllVideos();

    const map = new Map<number, { title: string; description: string }>();
    videos.forEach((video) => {
      map.set(video.id, { title: video.title, description: video.description });
    });

    return map;
  }

  async packageStatisticsWithRange(
    start: Date,
    end: Date,
  ): Promise<Map<number, number>> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pastStatistics =
      start < today
        ? await this.statisticsPastRepository.findPackageStatisticsWithTimeRange(
            start,
            end,
          )
        : null;

    const todayStatistics =
      end > today
        ? await this.statisticsTodayRepository.findPackageStatisticsWithTimeRange(
            start,
            end,
          )
        : null;

    const map = new Map<number, number>();
    this.statisticsHelper.addPackageClickCount(map, pastStatistics);
    this.statisticsHelper.addPackageClickCount(map, todayStatistics);

    return map;
  }

  async videoStatisticsWithRange(
    start: Date,
    end: Date,
  ): Promise<Map<number, PackageStatistics[]>> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pastStatistics =
      start < today
        ? await this.statisticsPastRepository.findVideoStatisticsWithTimeRange(
            start,
            end,
          )
        : [];

    const todayStatistics =
      end > today
        ? await this.statisticsTodayRepository.findVideoStatisticsWithTimeRange(
            start,
            end,
          )
        : [];

    const map = new Map<number, PackageStatistics[]>();
    this.statisticsHelper.mapByPackageId(map, pastStatistics);
    this.statisticsHelper.mapByPackageId(map, todayStatistics);

    return map;
  }

  async findAllTodayStatistics(): Promise<PackageStatistics[]> {
    return await this.statisticsTodayRepository.findAll();
  }

  async createPastStatistics(
    statistics: PackageStatistics[],
    date: Date,
  ): Promise<boolean> {
    return await this.statisticsPastRepository.createStatistics(
      statistics,
      date,
    );
  }

  async resetStatisticCount() {
    return await this.statisticsTodayRepository.resetClickCount();
  }
}
