import { forwardRef, Module } from '@nestjs/common';
import { FacadeFactory } from '../application/facade.factory';
import { ProductModule } from './product.module';
import { PackageModule } from './package.module';

@Module({
  imports: [forwardRef(() => ProductModule), forwardRef(() => PackageModule)],
  providers: [FacadeFactory],
  exports: [FacadeFactory],
})
export class FacadeModule {}
