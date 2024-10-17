import { ProductMediaEntity } from '../entity/product-media.entity';
import { ProductCard } from '../../../domain/product/model/product-card';
import { ProductVideo } from '../../../domain/product/model/product-video';

export class ProductMediaMapper {
  static toCardDomain(entity: ProductMediaEntity) {
    return new ProductCard(
      entity.id,
      entity.productId,
      entity.title,
      entity.url,
      entity.cardMappedMediaId,
      entity.description || null,
    );
  }

  static toVideoDomain(entity: ProductMediaEntity) {
    return new ProductVideo(
      entity.id,
      entity.productId,
      entity.title,
      entity.description,
      entity.url,
    );
  }
}
