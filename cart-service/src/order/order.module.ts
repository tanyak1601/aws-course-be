import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './services';
import { Orders } from './entities';

@Module({
  imports: [ TypeOrmModule.forFeature([Orders])],
  providers: [ OrderService ],
  exports: [ OrderService ]
})
export class OrderModule {}
