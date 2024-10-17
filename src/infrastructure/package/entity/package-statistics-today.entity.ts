import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StatisticsEnum } from '../../../common/enum/statistics.enum';

@Entity('samsung_ai_life_package_statistics_today')
@Index('samsung_ai_life_package_statistics_today_index_3', [
  'packageId',
  'packageMediaId',
])
export class PackageStatisticsTodayEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'package_id', type: 'bigint', nullable: true })
  packageId: number;

  @Column({ name: 'package_media_id', type: 'bigint', nullable: true })
  packageMediaId: number;

  @Column({ type: 'varchar', length: 255 })
  type: StatisticsEnum;

  @Column({ name: 'click_count', type: 'int', default: 1 })
  clickCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;
}
