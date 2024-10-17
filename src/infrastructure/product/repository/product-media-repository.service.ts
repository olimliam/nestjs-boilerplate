import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductMediaEntity } from '../entity/product-media.entity';
import { ProductCard } from '../../../domain/product/model/product-card';
import { ProductMediaMapper } from '../mapper/product-media.mapper';
import { ProductVideo } from '../../../domain/product/model/product-video';
import { ProductMediaEnum } from '../../../common/enum/product-media.enum';
import { StatisticsEnum } from '../../../common/enum/statistics.enum';

@Injectable()
export class ProductMediaRepository {
  constructor(
    @InjectRepository(ProductMediaEntity)
    private readonly repository: Repository<ProductMediaEntity>,
  ) {}

  async findAllCards(): Promise<ProductCard[]> {
    const productMedias = await this.repository.find({
      where: { type: ProductMediaEnum.VIDEO.toString() },
    });

    return productMedias.map((media) => ProductMediaMapper.toCardDomain(media));
  }

  async findProductVideos(productId: number): Promise<ProductVideo[]> {
    const productVideos = await this.repository.find({
      where: { type: ProductMediaEnum.VIDEO, productId: productId },
    });

    return productVideos.map((video) =>
      ProductMediaMapper.toVideoDomain(video),
    );
  }

  async findAllVideos(): Promise<ProductVideo[]> {
    const videos = await this.repository.find({
      where: { type: StatisticsEnum.VIDEO },
    });

    return videos.map((video) => {
      video.productId = Number(video.productId);
      video.id = Number(video.id);
      return ProductMediaMapper.toVideoDomain(video);
    });
  }
}
