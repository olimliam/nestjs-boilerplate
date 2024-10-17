import { PackageMediaEntity } from '../entity/package-media.entity';
import { PackageVideo } from '../../../domain/package/model/package-video';

export class PackageMediaMapper {
  static toDomain(entity: PackageMediaEntity): PackageVideo {
    return new PackageVideo(
      entity.id,
      entity.packageId,
      entity.title,
      entity.description,
      entity.url,
    );
  }
}
