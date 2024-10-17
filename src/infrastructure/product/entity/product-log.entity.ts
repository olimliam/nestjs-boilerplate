import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StatisticsEnum } from '../../../common/enum/statistics.enum';

@Entity('samsung_ai_life_product_log')
@Index(['createdAt', 'productId', 'productMediaId'])
export class ProductLogEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'product_id', type: 'bigint', nullable: true })
  productId: number;

  @Column({ name: 'product_media_id', type: 'bigint', nullable: true })
  productMediaId: number;

  @Column({ type: 'varchar' })
  type: StatisticsEnum;

  @Column({ name: 'api_url' })
  apiUrl: string;

  @Column({ name: 'ip_address' })
  ipAddress: string;

  @Column({ name: 'device_type' })
  deviceType: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt: Date;
}
