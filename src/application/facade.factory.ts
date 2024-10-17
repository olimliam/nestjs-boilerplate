import { Injectable } from '@nestjs/common';
import { ProductFacade } from './facade/product.facade';
import { PackageFacade } from './facade/package.facade';
import { StatisticsEnum } from '../common/enum/statistics.enum';
import { CustomException } from '../common/exception/custom.exception';
import { ErrorEnum } from '../common/exception/data/error.enum';

@Injectable()
export class FacadeFactory {
  constructor(
    private readonly productFacade: ProductFacade,
    private readonly packageFacade: PackageFacade,
  ) {}

  getFacade(type: string) {
    if (type == StatisticsEnum.PRODUCT) return this.productFacade;
    else if (type == StatisticsEnum.PACKAGE) return this.packageFacade;
    else throw new CustomException(ErrorEnum.BAD_REQUEST);
  }
}
