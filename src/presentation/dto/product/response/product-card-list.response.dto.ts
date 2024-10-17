import { ProductCard } from '../../../../domain/product/model/product-card';

export class ProductCardListResponseDto {
  constructor(public cardList: CardResponseDto[]) {}

  static fromDomain(domainList: ProductCard[]): ProductCardListResponseDto {
    return new ProductCardListResponseDto(
      domainList.map((domain) => CardResponseDto.fromDomain(domain)),
    );
  }
}

export class CardResponseDto {
  constructor(
    public id: number,
    public productId: number,
    public title: string,
    public imageUrl: string,
    public count: number,
    public percent: number,
    public description?: string,
  ) {}

  static fromDomain(domain: ProductCard): CardResponseDto {
    return new CardResponseDto(
      domain.id,
      domain.productId,
      domain.title,
      domain.imageUrl,
      domain.count,
      domain.percent,
      domain.description || null,
    );
  }
}
