import { PackageStatistics } from '../../../domain/package/model/package-statistics';
import { PackageStatisticsTodayEntity } from '../entity/package-statistics-today.entity';

export class PackageStatisticsTodayMapper {
  static toDomain(entity: PackageStatisticsTodayEntity): PackageStatistics {
    return new PackageStatistics(
      entity.type,
      entity.clickCount,
      entity.packageId || null,
      entity.packageMediaId || null,
    );
  }
}
