import { ProductService } from '../../domain/product/product.service';
import { Product } from '../../domain/product/model/product';
import { Injectable } from '@nestjs/common';
import { ProductCard } from '../../domain/product/model/product-card';
import { ProductVideo } from '../../domain/product/model/product-video';
import { FacadeInterface } from '../facade.interface';
import { CreateClickLogInfo } from '../model/create-click-log.info';
import {
  StatisticsWithRangeResponseDto,
  VideoStatisticsWithRangeResponseDto,
} from '../../presentation/dto/statistics/response/statistics-with-range-response.dto';
import { ProductStatistics } from '../../domain/product/model/product-statistics';
import { CustomException } from '../../common/exception/custom.exception';
import { ErrorEnum } from '../../common/exception/data/error.enum';
import { StatisticsSortEnum } from '../../common/enum/statistics-sort.enum';
import { RankingUtil } from '../../common/utils/ranking.util';

@Injectable()
export class ProductFacade implements FacadeInterface {
  constructor(private readonly productService: ProductService) {}

  async productList(withCount: boolean) {
    const products: Product[] = await this.productService.getProductList();

    if (withCount) {
      const productIdList = products.map((product) => product.id);
      const statisticsMap =
        await this.productService.getProductStatistics(productIdList);
      const rankingMap = RankingUtil.getRanking(statisticsMap);

      products.forEach((product) => {
        product.count = statisticsMap.get(product.id) || 0;
        product.percent = rankingMap.get(product.id);
      });
    }
    return products;
  }

  async cardList(): Promise<ProductCard[]> {
    const cards: ProductCard[] = await this.productService.getCardList();

    if (!cards.length) return cards;

    const thumbnailVideoIds = cards.map((card) => card.cardMappedMediaId);
    const statisticsMap =
      await this.productService.getCardStatistics(thumbnailVideoIds);
    const rankingMap = RankingUtil.getRanking(statisticsMap);

    cards.forEach((card) => {
      card.count = statisticsMap.get(card.productId) || 0;
      card.percent = rankingMap.get(card.productId);
    });
    return cards;
  }

  async videoList(productId: number) {
    const videos: ProductVideo[] =
      await this.productService.getVideoList(productId);

    if (!videos.length) return videos;

    const videoIds = videos.map((video) => video.id);
    const statisticsMap =
      await this.productService.getVideoStatistics(videoIds);
    const rankingMap = RankingUtil.getRanking(statisticsMap);

    videos.forEach((video) => {
      video.count = statisticsMap.get(video.id) || 0;
      video.percent = rankingMap.get(video.id);
    });
    return videos;
  }

  async countPageClick(): Promise<number> {
    return await this.productService.countPageClick();
  }

  async createClickLog(request: CreateClickLogInfo): Promise<boolean> {
    return await this.productService.createClickLog(request);
  }

  async updateClickCountAfterGivenDate(date: Date): Promise<boolean> {
    const clickCounts =
      await this.productService.countClicksAfterGivenDate(date);

    if (!clickCounts) return true;

    return await this.productService.updateStatistics(clickCounts);
  }

  async countPageClickWithTimeRange(start: Date, end: Date): Promise<number> {
    return await this.productService.countPageClickWithTimeRange(start, end);
  }

  async statisticsWithTimeRange(
    start: Date,
    end: Date,
    type: StatisticsSortEnum,
  ): Promise<StatisticsWithRangeResponseDto[]> {
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    // 패키지 id-name Map 조회
    const productServiceIdNameMap: Map<
      number,
      { name: string; description: string }
    > = await this.productService.findProductNameList();

    // 비디오 id-name Map 조회
    const videoIdNameMap: Map<number, { title: string; description: string }> =
      await this.productService.findVideoNameList();

    // 범위 내의 패키지 통계 조회
    const productServiceIdClickCountMap: Map<number, number> =
      await this.productService.productStatisticsWithRange(start, end);
    const productClickRankingMap: Map<number, number> = RankingUtil.getRanking(
      productServiceIdClickCountMap,
    );

    // 범위 내의 비디오 통계 조회
    let productServiceIdVideoMap: Map<number, ProductStatistics[]> =
      await this.productService.findVideoStatisticsWithRange(start, end);
    productServiceIdVideoMap = this.getProductMediaRanking(
      productServiceIdVideoMap,
    );

    // 패키지 id 개수만큼 반복해서 객체 배열 만들기
    const statisticsArray: StatisticsWithRangeResponseDto[] = [];
    for (const [
      productId,
      { name, description },
    ] of productServiceIdNameMap.entries()) {
      const clickCount = productServiceIdClickCountMap.get(productId);
      const rankCount = productClickRankingMap.get(productId);

      const videos = productServiceIdVideoMap.get(productId) || [];
      const videoInfos: VideoStatisticsWithRangeResponseDto[] = videos.map(
        (video) => {
          // clickCount += video.clickCount;
          return new VideoStatisticsWithRangeResponseDto(
            video.productMediaId,
            videoIdNameMap.get(video.productMediaId).title,
            videoIdNameMap.get(video.productMediaId).description,
            video.clickCount,
            video.rankCount,
          );
        },
      );

      // 패키지 전체의 정보
      const productInfo: StatisticsWithRangeResponseDto =
        new StatisticsWithRangeResponseDto(
          productId,
          name,
          description,
          clickCount,
          rankCount,
          videoInfos,
        );

      statisticsArray.push(productInfo);
    }
    if (type == StatisticsSortEnum.ASC)
      statisticsArray.sort((a, b) => a.count - b.count);
    else statisticsArray.sort((a, b) => b.count - a.count);

    return statisticsArray;
  }

  async updateProductStatisticsDaily() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // today 테이블에 집된된 통계 조회
    const statistics = await this.productService.findAllTodayStatistics();

    // past 통계 테이블에 어제 통계만큼 clickCount 증가
    const result = await this.productService.createPastStatistics(
      statistics,
      yesterday,
    );

    if (!result) throw new CustomException(ErrorEnum.STATISTICS_CREATE_FAILED);

    // today 테이블의 clickCount 0으로 초기화
    await this.productService.resetStatisticCount();

    if (!result)
      throw new CustomException(ErrorEnum.STATISTICS_COUNT_RESET_FAILED);
  }

  private getProductMediaRanking(
    productMediaMap: Map<number, ProductStatistics[]>,
  ): Map<number, ProductStatistics[]> {
    const productMediaRankingMap: Map<number, number> = new Map<
      number,
      number
    >();

    // productMediaMap을 순회하며 모든 Item들을 Map 으로 매핑한다.
    for (const value of productMediaMap.values()) {
      value.forEach((subMediaItem) => {
        productMediaRankingMap.set(
          subMediaItem.productMediaId,
          subMediaItem.clickCount,
        );
      });
    }
    const clickRankingMap: Map<number, number> = RankingUtil.getRanking(
      productMediaRankingMap,
    );

    // 매핑된 값들의 랭킹을 가져와 rankingMap 으로 만든다.
    // 랭킹을 productMediaMap에 반영
    for (const [key, value] of productMediaMap) {
      const rankedValue = value.map((subMediaItem) => {
        return {
          ...subMediaItem,
          rankCount: clickRankingMap.get(subMediaItem.productMediaId) || 0, // null 체크
        };
      });
      productMediaMap.set(key, rankedValue); // 수정된 값을 다시 map에 set
    }

    return productMediaMap;
  }
}
