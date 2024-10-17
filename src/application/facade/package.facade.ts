import { Injectable } from '@nestjs/common';
import { PackageService } from '../../domain/package/package.service';
import { Package } from '../../domain/package/model/package';
import { PackageVideo } from '../../domain/package/model/package-video';
import { FacadeInterface } from '../facade.interface';
import { CreateClickLogInfo } from '../model/create-click-log.info';
import { PackageStatistics } from '../../domain/package/model/package-statistics';
import {
  StatisticsWithRangeResponseDto,
  VideoStatisticsWithRangeResponseDto,
} from '../../presentation/dto/statistics/response/statistics-with-range-response.dto';
import { CustomException } from '../../common/exception/custom.exception';
import { ErrorEnum } from '../../common/exception/data/error.enum';
import { StatisticsSortEnum } from '../../common/enum/statistics-sort.enum';
import { RankingUtil } from '../../common/utils/ranking.util';

@Injectable()
export class PackageFacade implements FacadeInterface {
  constructor(private readonly packageService: PackageService) {}

  async packageList(): Promise<Package[]> {
    const packages: Package[] = await this.packageService.packageList();

    const packageIds = packages.map((p) => p.id);
    const statisticsMap: Map<number, number> =
      await this.packageService.findPackageStatistics(packageIds);
    const rankingMap: Map<number, number> =
      RankingUtil.getRanking(statisticsMap);

    packages.forEach((p) => {
      p.count = statisticsMap.get(p.id) || 0;
      p.percent = rankingMap.get(p.id);
    });

    return packages;
  }

  async packageVideoList(packageId: number): Promise<PackageVideo[]> {
    const videos: PackageVideo[] =
      await this.packageService.packageVideoList(packageId);

    const videoIds = videos.map((video) => video.id);
    const statisticsMap: Map<number, number> =
      await this.packageService.findVideoStatistics(videoIds);
    const rankingMap: Map<number, number> =
      RankingUtil.getRanking(statisticsMap);

    videos.forEach((video) => {
      video.count = statisticsMap.get(video.id) || 0;
      video.percent = rankingMap.get(video.id);
    });
    return videos;
  }

  async countPageClick(): Promise<number> {
    return await this.packageService.countPageClick();
  }

  async createClickLog(request: CreateClickLogInfo): Promise<boolean> {
    return await this.packageService.createClickLog(request);
  }

  async updateClickCountAfterGivenDate(date: Date): Promise<boolean> {
    const clickCounts =
      await this.packageService.countClicksAfterGivenDate(date);

    if (!clickCounts) return true;

    return await this.packageService.updateStatistics(clickCounts);
  }

  async countPageClickWithTimeRange(start: Date, end: Date): Promise<number> {
    return await this.packageService.countPageClickWithTimeRange(start, end);
  }

  async statisticsWithTimeRange(
    start: Date,
    end: Date,
    type: StatisticsSortEnum,
  ): Promise<StatisticsWithRangeResponseDto[]> {
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    // 패키지 id-name Map 조회
    const packageIdNameMap: Map<number, { name: string; description: string }> =
      await this.packageService.findPackageNameList();

    // 비디오 id-name Map 조회
    const videoIdNameMap: Map<number, { title: string; description: string }> =
      await this.packageService.findVideoNameList();

    // 범위 내의 패키지 통계 조회
    const packageIdClickCountMap: Map<number, number> =
      await this.packageService.packageStatisticsWithRange(start, end);
    const packageClickRankingMap: Map<number, number> = RankingUtil.getRanking(
      packageIdClickCountMap,
    );

    // 범위 내의 비디오 통계 조회
    let packageIdVideoMap: Map<number, PackageStatistics[]> =
      await this.packageService.videoStatisticsWithRange(start, end);

    // 여기에서 ranking을 환산한다.
    packageIdVideoMap = this.getPackageMediaRanking(packageIdVideoMap);

    // 패키지 id 개수만큼 반복해서 객체 배열 만들기
    const statisticsArray: StatisticsWithRangeResponseDto[] = [];
    for (const [
      packageId,
      { name, description },
    ] of packageIdNameMap.entries()) {
      const clickCount = packageIdClickCountMap.get(packageId);
      const rankCount = packageClickRankingMap.get(packageId);
      // 패키지의 비디오 정보
      const videos = packageIdVideoMap.get(packageId) || [];
      const videoInfos: VideoStatisticsWithRangeResponseDto[] = videos.map(
        (video) => {
          // clickCount += video.clickCount; // video click Count 를 패키지 카운트에 더한다?
          return new VideoStatisticsWithRangeResponseDto(
            video.packageMediaId,
            videoIdNameMap.get(video.packageMediaId).title,
            videoIdNameMap.get(video.packageMediaId).description,
            video.clickCount,
            video.rankCount,
          );
        },
      );

      // 패키지 전체의 정보
      const packageInfo: StatisticsWithRangeResponseDto =
        new StatisticsWithRangeResponseDto(
          packageId,
          name,
          description,
          clickCount,
          rankCount,
          videoInfos,
        );

      statisticsArray.push(packageInfo);
    }

    if (type == StatisticsSortEnum.ASC)
      statisticsArray.sort((a, b) => a.count - b.count);
    else statisticsArray.sort((a, b) => b.count - a.count);

    return statisticsArray;
  }

  async updatePastProductStatistics() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // today 테이블에 집된된 통계 조회
    const statistics = await this.packageService.findAllTodayStatistics();

    // past 통계 테이블에 어제 통계만큼 clickCount 증가
    const result = await this.packageService.createPastStatistics(
      statistics,
      yesterday,
    );

    if (!result) throw new CustomException(ErrorEnum.STATISTICS_CREATE_FAILED);

    // today 테이블의 clickCount 0으로 초기화
    await this.packageService.resetStatisticCount();

    if (!result)
      throw new CustomException(ErrorEnum.STATISTICS_COUNT_RESET_FAILED);
  }

  async packageVideoAllList(): Promise<PackageVideo[]> {
    const videos: PackageVideo[] = await this.packageService.findAllVideoList();

    const videoIds = videos.map((video) => video.id);
    const statisticsMap: Map<number, number> =
      await this.packageService.findVideoStatistics(videoIds);
    const rankingMap: Map<number, number> =
      RankingUtil.getRanking(statisticsMap);

    videos.forEach((video) => {
      video.count = statisticsMap.get(video.id) || 0;
      video.percent = rankingMap.get(video.id);
    });
    return videos;
  }

  private getPackageMediaRanking(
    packageMediaMap: Map<number, PackageStatistics[]>,
  ): Map<number, PackageStatistics[]> {
    const packageMediaRankingMap: Map<number, number> = new Map<
      number,
      number
    >();

    // packageMediaMap을 순회하며 모든 Item들을 Map 으로 매핑한다.
    for (const [key, value] of packageMediaMap) {
      console.log(key);
      value.forEach((subMediaItem) => {
        console.log('subMediaItem', subMediaItem);
        packageMediaRankingMap.set(
          subMediaItem.packageMediaId,
          subMediaItem.clickCount,
        );
      });
    }
    const clickRankingMap: Map<number, number> = RankingUtil.getRanking(
      packageMediaRankingMap,
    );

    // 매핑된 값들의 랭킹을 가져와 rankingMap 으로 만든다.
    // 랭킹을 packageMediaMap에 반영
    for (const [key, value] of packageMediaMap) {
      const rankedValue = value.map((subMediaItem) => {
        return {
          ...subMediaItem,
          rankCount: clickRankingMap.get(subMediaItem.packageMediaId) || 0, // null 체크
        };
      });
      packageMediaMap.set(key, rankedValue); // 수정된 값을 다시 map에 set
    }

    return packageMediaMap;
  }
}
