import { Injectable } from '@nestjs/common';
import { PackageLogEntity } from '../entity/package-log.entity';
import { Repository } from 'typeorm';
import { CreateClickLogInfo } from '../../../application/model/create-click-log.info';
import { Builder } from 'builder-pattern';
import { CustomException } from '../../../common/exception/custom.exception';
import { ErrorEnum } from '../../../common/exception/data/error.enum';
import { PackageStatistics } from '../../../domain/package/model/package-statistics';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PackageLogRepository {
  constructor(
    @InjectRepository(PackageLogEntity)
    private readonly repository: Repository<PackageLogEntity>,
  ) {}

  async createPackageLog(request: CreateClickLogInfo): Promise<boolean> {
    const entity = Builder<PackageLogEntity>()
      .packageId(request.id)
      .packageMediaId(request.mediaId)
      .type(request.type)
      .apiUrl(request.url)
      .deviceType(request.device)
      .ipAddress(request.ip)
      .build();
    const result = await this.repository.save(entity);

    if (!result) throw new CustomException(ErrorEnum.LOG_CREATE_FAILED);

    return true;
  }

  async countClicksAfterGivenDate(date: Date): Promise<PackageStatistics[]> {
    const formattedDate = date.toISOString().slice(0, 19).replace('T', ' ');
    const logs = await this.repository
      .createQueryBuilder('log')
      .select('log.type', 'type')
      .addSelect('log.package_id', 'packageId')
      .addSelect('log.package_media_id', 'packageMediaId')
      .addSelect('COUNT(log.id)', 'clickCount')
      .where('log.created_at > :date', { date: formattedDate })
      .groupBy('log.type')
      .addGroupBy('log.package_id')
      .addGroupBy('log.package_media_id')
      .getRawMany();

    return logs.map((log) => {
      log.clickCount = Number(log.clickCount);
      log.packageId = log.packageId ? Number(log.packageId) : null;
      log.packageMediaId = log.packageMediaId
        ? Number(log.packageMediaId)
        : null;
      return new PackageStatistics(
        log.type,
        log.clickCount,
        log.packageId,
        log.packageMediaId,
      );
    });
  }
}
