import { ProductLogEntity } from '../entity/product-log.entity';
import { ProductLog } from '../../../domain/product/model/product-log';

export class ProductLogMapper {
  static toDomain(entity: ProductLogEntity): ProductLog {
    return new ProductLog(
      entity.type,
      entity.apiUrl,
      entity.ipAddress,
      entity.deviceType,
      entity.productId || null,
      entity.productMediaId || null,
    );
  }
}
