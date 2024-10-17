import { StatisticsEnum } from '../../../common/enum/statistics.enum';

export class ProductStatistics {
  type: StatisticsEnum;
  clickCount: number;
  productId?: number;
  productMediaId?: number;
  rankCount?: number;

  constructor(
    type: StatisticsEnum,
    clickCount: number,
    productId?: number,
    productMediaId?: number,
    rankCount?: number,
  ) {
    this.type = type;
    this.clickCount = clickCount;
    this.productId = productId || null;
    this.productMediaId = productMediaId || null;
    this.rankCount = rankCount || null;
  }
}
