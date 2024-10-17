import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PackageSwaggerData } from '../data/package.swagger.data';
import { PackageListResponseDto } from '../dto/package/request/package-list.response.dto';
import { PackageVideoListResponseDto } from '../dto/package/response/package-video-list.response.dto';
import { PackageFacade } from '../../application/facade/package.facade';

@ApiTags('패키지 페이지 조회 API')
@Controller('api/package')
export class PackageController {
  constructor(private readonly packageFacade: PackageFacade) {}

  @Get('/list')
  @ApiOperation({ summary: '패키지 리스트와 하단의 제품 리스트를를 조회' })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: PackageListResponseDto,
    example: PackageSwaggerData.packageListResponse,
  })
  async packageList(): Promise<PackageListResponseDto> {
    return PackageListResponseDto.fromDomain(
      await this.packageFacade.packageList(),
    );
  }

  @Get('/:packageId/videos')
  @ApiOperation({ summary: '제품 리스트와 제품별 카드 리스트를 조회' })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: PackageVideoListResponseDto,
    example: PackageSwaggerData.packageVideoListResponse,
  })
  async packageVideoList(
    @Param('packageId') packageId: number,
  ): Promise<PackageVideoListResponseDto> {
    return PackageVideoListResponseDto.fromDomain(
      await this.packageFacade.packageVideoList(packageId),
    );
  }

  @Get('/videos')
  @ApiOperation({ summary: '모든 동영상 리스트를 조회' })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: PackageVideoListResponseDto,
  })
  async videoList(): Promise<PackageVideoListResponseDto> {
    return PackageVideoListResponseDto.fromDomain(
      await this.packageFacade.packageVideoAllList(),
    );
  }
}
