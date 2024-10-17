import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PackageMediaEntity } from '../entity/package-media.entity';
import { Repository } from 'typeorm';
import { PackageVideo } from '../../../domain/package/model/package-video';
import { PackageMediaMapper } from '../mapper/package-media.mapper';
import { StatisticsEnum } from '../../../common/enum/statistics.enum';

@Injectable()
export class PackageMediaRepository {
  constructor(
    @InjectRepository(PackageMediaEntity)
    private readonly repository: Repository<PackageMediaEntity>,
  ) {}

  async findPackageVideos(packageId: number): Promise<PackageVideo[]> {
    const videos = await this.repository.find({
      where: { packageId: packageId, type: StatisticsEnum.VIDEO },
    });

    return videos.map((video) => {
      video.id = Number(video.id);
      return PackageMediaMapper.toDomain(video);
    });
  }

  async findAllVideos() {
    const videos = await this.repository.find({
      where: { type: StatisticsEnum.VIDEO },
    });

    return videos.map((video) => {
      video.packageId = Number(video.packageId);
      video.id = Number(video.id);
      return PackageMediaMapper.toDomain(video);
    });
  }
}
