import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductEntity } from './product.entity';
import { ProductMediaEntity } from './product-media.entity';
import { StatisticsEnum } from '../../../common/enum/statistics.enum';

@Entity('samsung_ai_life_product_statistics_today')
export class ProductStatisticsTodayEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'product_id', type: 'bigint', nullable: true })
  productId: number;

  @Column({ name: 'product_media_id', type: 'bigint', nullable: true })
  productMediaId: number;

  @Column({ type: 'varchar' })
  type: StatisticsEnum;

  @Column({ name: 'click_count', type: 'int', default: 0 })
  clickCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @ManyToOne(() => ProductEntity, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'product_id' })
  product?: ProductEntity;

  @ManyToOne(() => ProductMediaEntity, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'product_media_id' })
  productMedia?: ProductMediaEntity;
}
