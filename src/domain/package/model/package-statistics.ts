import { StatisticsEnum } from '../../../common/enum/statistics.enum';

export class PackageStatistics {
  constructor(
    public type: StatisticsEnum,
    public clickCount: number,
    public packageId?: number,
    public packageMediaId?: number,
    public rankCount?: number,
  ) {}
}
