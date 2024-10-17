import { Product } from '../../../../domain/product/model/product';
import { isNumber } from '@nestjs/common/utils/shared.utils';

export class ProductListResponseDto {
  constructor(public productList: ProductResponseDto[]) {}

  static fromDomain(products: Product[]): ProductListResponseDto {
    const productList = products.map((product) =>
      ProductResponseDto.fromDomain(product),
    );
    return new ProductListResponseDto(productList);
  }
}

export class ProductResponseDto {
  constructor(
    public id: number,
    public name: string,
    public imageUrl: string,
    public description?: string,
    public count?: number,
    public percent?: number,
  ) {}

  static fromDomain(product: Product): ProductResponseDto {
    return new ProductResponseDto(
      product.id,
      product.name,
      product.imageUrl,
      product.description,
      isNumber(product.count) ? product.count : null,
      isNumber(product.percent) ? product.percent : null,
    );
  }
}
