import { PackageVideo } from '../../../../domain/package/model/package-video';

export class PackageVideoListResponseDto {
  constructor(public videoList: PackageVideoResponseDto[]) {}

  static fromDomain(domains: PackageVideo[]): PackageVideoListResponseDto {
    return new PackageVideoListResponseDto(
      domains.map((domain) => PackageVideoResponseDto.fromDomain(domain)),
    );
  }
}

export class PackageVideoResponseDto {
  constructor(
    public videoId: number,
    public packageId: number,
    public title: string,
    public url: string,
    public count: number,
    public percent: number,
  ) {}

  static fromDomain(domain: PackageVideo): PackageVideoResponseDto {
    return new PackageVideoResponseDto(
      domain.id,
      domain.packageId,
      domain.title,
      domain.url,
      domain.count || 0,
      domain.percent,
    );
  }
}
