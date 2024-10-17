import { StatisticsSortEnum } from '../../../../common/enum/statistics-sort.enum';
import { IsDate, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class StatisticsRequestDto {
  @IsDate()
  @Type(() => Date)
  public start: Date;

  @IsDate()
  @Type(() => Date)
  public end: Date;

  @IsOptional()
  @IsEnum(StatisticsSortEnum)
  type?: StatisticsSortEnum;
}
