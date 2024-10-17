import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductEntity } from './product.entity';
import { ProductMediaEntity } from './product-media.entity';
import { StatisticsEnum } from '../../../common/enum/statistics.enum';

@Entity('samsung_ai_life_product_statistics_past')
@Index(['createdAt', 'productId', 'productMediaId'])
export class ProductStatisticsPastEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'product_id', type: 'bigint', nullable: true })
  productId: number;

  @Column({ name: 'product_media_id', type: 'bigint', nullable: true })
  productMediaId: number;

  @Column({ type: 'varchar' })
  type: StatisticsEnum; // enum을 DB에 문자열로 저장

  @Column({ name: 'click_count', type: 'int', default: 1 })
  clickCount: number;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt: Date;

  @ManyToOne(() => ProductEntity, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'product_id' })
  productEntity?: ProductEntity;

  @ManyToOne(() => ProductMediaEntity, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'product_media_id' })
  productMediaEntity?: ProductMediaEntity;
}
