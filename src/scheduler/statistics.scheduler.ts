import { Cron, CronExpression } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { ProductFacade } from '../application/facade/product.facade';
import { PackageFacade } from '../application/facade/package.facade';

@Injectable()
export class StatisticsScheduler {
  constructor(
    private readonly productFacade: ProductFacade,
    private readonly packageFacade: PackageFacade,
  ) {}

  // @Cron('30,59 * * * * ')
  @Cron('*/10 * * * *')
  async updateProductStatistics() {
    await this.productFacade.updateClickCountAfterGivenDate(
      this.getDateTenMinutesAgo(),
    );
  }

  // @Cron('30,59 * * * * ')
  @Cron('*/10 * * * *')
  async updatePackageStatistics() {
    await this.packageFacade.updateClickCountAfterGivenDate(
      this.getDateTenMinutesAgo(),
    );
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updatePastProductStatistics() {
    await this.productFacade.updateProductStatisticsDaily();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updatePastPackageStatistics() {
    await this.packageFacade.updatePastProductStatistics();
  }

  private getDateTenMinutesAgo(): Date {
    const tenMinutesAgo = new Date();
    tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10);
    return tenMinutesAgo;
  }
}
