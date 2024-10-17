import { ProductVideo } from '../../../../domain/product/model/product-video';

export class ProductMediaResponseDto {
  constructor(public videoList: ProductMediaDto[]) {}

  static fromDomain(domains: ProductVideo[]): ProductMediaResponseDto {
    return new ProductMediaResponseDto(
      domains.map((domain) => ProductMediaDto.fromDomain(domain)),
    );
  }
}

export class ProductMediaDto {
  constructor(
    public id: number,
    public title: string,
    public url: string,
    public count: number,
    public percent: number,
  ) {}

  static fromDomain(domain: ProductVideo): ProductMediaDto {
    return new ProductMediaDto(
      domain.id,
      domain.title,
      domain.url,
      domain.count || 0,
      domain.percent,
    );
  }
}
