import { Controller, Get, Delete, Put, Body, Req, Post, HttpStatus } from '@nestjs/common';

// import { BasicAuthGuard, JwtAuthGuard } from '../auth';
import { OrderService } from '../order';
import { AppRequest, getUserIdFromQueryParams } from '../shared';

import { CartService } from './services';
import { Carts } from './entities'
import { CheckOutBody } from './models';

@Controller('api/profile/cart')
export class CartController {
  constructor(
    private cartService: CartService,
    private orderService: OrderService
  ) { }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Get()
  async findUserCart(@Req() req: AppRequest) {
    try {
      const cart = await this.cartService.findOrCreateByUserId(getUserIdFromQueryParams(req));
      console.log('cart', cart);
      
      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: cart,
      }
    } catch (error) {
      console.log(error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      }
    }
  }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Put()
  async updateUserCart(@Req() req: AppRequest, @Body() body: Carts) {
    try {
      const cart = await this.cartService.updateByUserId(getUserIdFromQueryParams(req), body)

      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: {
          cart,
        }
      }
    } catch (error) {
      console.log(error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      }
    }
  }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Delete()
  async clearUserCart(@Req() req: AppRequest) {
    try {
      await this.cartService.removeByUserId(getUserIdFromQueryParams(req));

      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
      }
    } catch (error) {
      console.log(error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      }
    }

  }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Post('checkout')
  async checkout(@Req() req: AppRequest, @Body() body: CheckOutBody) {
    try {
      const userId = getUserIdFromQueryParams(req);
      const cart = await this.cartService.findByUserId(userId);

      if (!(cart && cart.cartItems.length)) {
        const statusCode = HttpStatus.BAD_REQUEST;
        req.statusCode = statusCode

        return {
          statusCode,
          message: 'Cart is empty',
        }
      }

      const { id: cartId } = cart;
      const order = await this.orderService.create({
        ...body,
        userId,
        cartId,
      });
      await this.cartService.softRemoveByUserId(userId);

      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: { order }
      }
    } catch (error) {
      console.log(error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      }
    }
  }
}
