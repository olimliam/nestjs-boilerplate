import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StatisticsEnum } from '../../../common/enum/statistics.enum';

@Entity('samsung_ai_life_package_log')
export class PackageLogEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'package_id', type: 'bigint', nullable: true })
  packageId: number;

  @Column({ name: 'package_media_id', type: 'bigint', nullable: true })
  packageMediaId: number;

  @Column({ type: 'varchar', length: 255 })
  type: StatisticsEnum;

  @Column({ name: 'api_url', type: 'varchar', length: 2000 })
  apiUrl: string;

  @Column({ name: 'ip_address', type: 'varchar', length: 255 })
  ipAddress: string;

  @Column({ name: 'device_type', type: 'varchar', length: 255 })
  deviceType: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;
}
