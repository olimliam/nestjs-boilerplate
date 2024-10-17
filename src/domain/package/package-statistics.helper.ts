import { Injectable } from '@nestjs/common';
import { PackageStatistics } from './model/package-statistics';

@Injectable()
export class PackageStatisticsHelper {
  addPackageClickCount(
    clickCountMap: Map<number, number>,
    stats: PackageStatistics[],
  ): Map<number, number> {
    stats?.forEach((stat) => {
      const currentCount = clickCountMap.get(stat.packageId) || 0;
      clickCountMap.set(stat.packageId, currentCount + stat.clickCount);
    });

    return clickCountMap;
  }

  addVideoClickCount(
    clickCountMap: Map<number, number>,
    stats: PackageStatistics[],
  ): Map<number, number> {
    stats?.forEach((stat) => {
      const currentCount = clickCountMap.get(stat.packageMediaId) || 0;
      clickCountMap.set(stat.packageMediaId, currentCount + stat.clickCount);
    });

    return clickCountMap;
  }

  mapByPackageId(
    map: Map<number, PackageStatistics[]>,
    stats: PackageStatistics[],
  ): Map<number, PackageStatistics[]> {
    stats?.forEach((stat) => {
      if (map.has(stat.packageId)) {
        const subMedia = map
          .get(stat.packageId)
          .find((media) => media.packageMediaId === stat.packageMediaId);
        if (subMedia) {
          subMedia.clickCount += stat.clickCount;
        } else {
          map.get(stat.packageId).push({ ...stat });
        }
      } else {
        map.set(stat.packageId, Array({ ...stat }));
      }
    });

    return map;
  }
}
