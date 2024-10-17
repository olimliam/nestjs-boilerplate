import { PackageStatisticsPastEntity } from '../entity/package-statistics-past.entity';
import { PackageStatistics } from '../../../domain/package/model/package-statistics';

export class PackageStatisticsPastMapper {
  static toDomain(entity: PackageStatisticsPastEntity): PackageStatistics {
    return new PackageStatistics(
      entity.type,
      entity.clickCount,
      entity.packageId || null,
      entity.packageMediaId || null,
    );
  }
}
