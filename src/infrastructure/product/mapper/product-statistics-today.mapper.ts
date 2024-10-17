import { ProductStatisticsTodayEntity } from '../entity/product-statistics-today.entity';
import { ProductStatistics } from '../../../domain/product/model/product-statistics';

export class ProductStatisticsTodayMapper {
  static toDomain(entity: ProductStatisticsTodayEntity): ProductStatistics {
    return new ProductStatistics(
      entity.type,
      entity.clickCount,
      entity.productId || null,
      entity.productMediaId || null,
    );
  }
}
