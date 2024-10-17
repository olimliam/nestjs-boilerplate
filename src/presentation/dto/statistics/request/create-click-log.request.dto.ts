import { StatisticsEnum } from '../../../../common/enum/statistics.enum';

export class CreateClickLogRequestDto {
  constructor(
    public pageType: StatisticsEnum.PRODUCT | StatisticsEnum.PACKAGE,
    public type: StatisticsEnum,
    public id?: number,
    public mediaId?: number,
  ) {}
}
