import { Injectable } from '@nestjs/common';
import { ProductStatistics } from './model/product-statistics';

@Injectable()
export class ProductStatisticsHelper {
  addProductClickCount(
    productClickMap: Map<number, number>,
    stats: ProductStatistics[],
  ): Map<number, number> {
    stats?.forEach((stat) => {
      const currentCount = productClickMap.get(stat.productId) || 0;
      productClickMap.set(stat.productId, currentCount + stat.clickCount);
    });

    return productClickMap;
  }

  addVideoClickCount(
    videoClickMap: Map<number, number>,
    stats: ProductStatistics[],
  ): Map<number, number> {
    stats?.forEach((stat) => {
      const currentCount = videoClickMap.get(stat.productMediaId) || 0;
      videoClickMap.set(stat.productMediaId, currentCount + stat.clickCount);
    });

    return videoClickMap;
  }

  mapByProductId(
    map: Map<number, ProductStatistics[]>,
    stats: ProductStatistics[],
  ): Map<number, ProductStatistics[]> {
    stats?.forEach((stat) => {
      // map에 productId가 있더라도 자식 객체가 겹치는지 한번 더
      // 확인을 해서 중복이라면 clickCount가 더해지도록 해야한다.
      if (map.has(stat.productId)) {
        // 하위 자식 media 객체
        const subMedia = map
          .get(stat.productId)
          .find((media) => media.productMediaId === stat.productMediaId);
        if (subMedia) {
          subMedia.clickCount += stat.clickCount;
        } else {
          map.get(stat.productId).push({ ...stat });
        }
      } else {
        map.set(stat.productId, Array(stat));
      }
    });

    return map;
  }
}
