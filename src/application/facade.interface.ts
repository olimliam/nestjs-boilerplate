import { CreateClickLogInfo } from './model/create-click-log.info';
import { StatisticsWithRangeResponseDto } from '../presentation/dto/statistics/response/statistics-with-range-response.dto';
import { StatisticsSortEnum } from '../common/enum/statistics-sort.enum';

export interface FacadeInterface {
  countPageClick(): Promise<number>;

  createClickLog(request: CreateClickLogInfo): Promise<boolean>;

  updateClickCountAfterGivenDate(date: Date): Promise<boolean>;

  statisticsWithTimeRange(
    start: Date,
    end: Date,
    type: StatisticsSortEnum,
  ): Promise<StatisticsWithRangeResponseDto[]>;

  countPageClickWithTimeRange(start: Date, end: Date): Promise<number>;
}
