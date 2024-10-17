import { Package } from '../../../../domain/package/model/package';

export class PackageListResponseDto {
  constructor(public packageList: PackageResponseDto[]) {}

  static fromDomain(domains: Package[]): PackageListResponseDto {
    return new PackageListResponseDto(
      domains.map((domain) => PackageResponseDto.fromDomain(domain)),
    );
  }
}

export class PackageResponseDto {
  constructor(
    public id: number,
    public name: string,
    public imageUrl: string,
    public count: number,
    public percent: number,
  ) {}

  static fromDomain(domain: Package): PackageResponseDto {
    return new PackageResponseDto(
      domain.id,
      domain.name,
      domain.imageUrl,
      domain.count || 0,
      domain.percent,
    );
  }
}
