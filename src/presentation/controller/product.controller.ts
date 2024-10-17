import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductMediaResponseDto } from '../dto/product/response/product-media-response.dto';
import { ProductListResponseDto } from '../dto/product/response/product-list.response.dto';
import { ProductSwaggerData } from '../data/product.swagger.data';
import { ProductFacade } from '../../application/facade/product.facade';
import { ProductCardListResponseDto } from '../dto/product/response/product-card-list.response.dto';

@ApiTags('제품 페이지 조회 API')
@Controller('api/product')
export class ProductController {
  constructor(private readonly productFacade: ProductFacade) {}

  @Get('/list')
  @ApiOperation({ summary: '제품 리스트를 조회' })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: ProductListResponseDto,
    example: ProductSwaggerData.productListResponse,
  })
  async productList(
    @Query('withCount') withCount: string,
  ): Promise<ProductListResponseDto> {
    return ProductListResponseDto.fromDomain(
      await this.productFacade.productList(withCount == 'true'),
    );
  }

  @Get('/cards')
  @ApiOperation({ summary: '제품별 카드 리스트를 조회' })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: ProductListResponseDto,
    example: ProductSwaggerData.productListResponse,
  })
  async cardList(): Promise<ProductCardListResponseDto> {
    return ProductCardListResponseDto.fromDomain(
      await this.productFacade.cardList(),
    );
  }

  @Get('/:productId/videos')
  @ApiOperation({ summary: '제품별 동영상 리스트를 조회' })
  @ApiParam({ name: 'productId', type: Number, description: '제품 아이디' })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: ProductMediaResponseDto,
    example: ProductSwaggerData.productMediaListResponse,
  })
  async productMediaList(
    @Param('productId') productId: number,
  ): Promise<ProductMediaResponseDto> {
    return ProductMediaResponseDto.fromDomain(
      await this.productFacade.videoList(productId),
    );
  }
}
