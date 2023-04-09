import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { AppController } from './app.controller';

import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { Carts, CartItems } from './cart/entities';
import { Orders } from './order/entities';

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: PG_HOST,
      port: +PG_PORT,
      username: PG_USERNAME,
      password: PG_PASSWORD,
      database: PG_DATABASE,
      namingStrategy: new SnakeNamingStrategy(),
      entities: [Carts, CartItems, Orders],
    }),
    AuthModule,
    CartModule,
    OrderModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [],
})
export class AppModule {}
