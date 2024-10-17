import { ProductStatisticsPastEntity } from '../entity/product-statistics-past.entity';
import { ProductStatistics } from '../../../domain/product/model/product-statistics';

export class ProductStatisticsPastMapper {
  static toDomain(entity: ProductStatisticsPastEntity): ProductStatistics {
    return new ProductStatistics(
      entity.type,
      entity.clickCount,
      entity.productId || null,
      entity.productMediaId || null,
    );
  }
}
