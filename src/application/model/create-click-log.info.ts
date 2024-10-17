import { StatisticsEnum } from '../../common/enum/statistics.enum';

export class CreateClickLogInfo {
  constructor(
    public type: StatisticsEnum,
    public ip: string,
    public device: string,
    public url: string,
    public id?: number,
    public mediaId?: number,
  ) {}
}
