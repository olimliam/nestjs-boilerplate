import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PackageEntity } from '../entity/package.entity';
import { Repository } from 'typeorm';
import { Package } from '../../../domain/package/model/package';
import { PackageMapper } from '../mapper/package.mapper';

@Injectable()
export class PackageRepository {
  constructor(
    @InjectRepository(PackageEntity)
    private readonly packageRepository: Repository<PackageEntity>,
  ) {}

  async findAll(): Promise<Package[]> {
    const packages: PackageEntity[] = await this.packageRepository.find();
    return packages.map((entity) => {
      entity.id = Number(entity.id);
      return PackageMapper.toDomain(entity);
    });
  }
}
