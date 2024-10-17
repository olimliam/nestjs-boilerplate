import { ProductEntity } from '../entity/product.entity';
import { Product } from '../../../domain/product/model/product';

export class ProductMapper {
  static toDomain(entity: ProductEntity): Product {
    return new Product(
      entity.id,
      entity.name,
      entity.imageUrl,
      entity.description,
    );
  }
}
