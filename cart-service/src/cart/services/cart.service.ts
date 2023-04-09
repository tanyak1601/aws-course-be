import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';

import { Status } from '../../shared';
import { Carts } from '../entities'

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Carts)
    private readonly userCarts: Repository<Carts>,
  ) {}

  async findByUserId(userId: string): Promise<Carts> {
    return this.userCarts.findOne({ where: { userId, status: Status.OPEN }, relations: ['cartItems'] });
  }

  async createByUserId(userId: string): Promise<Carts> {
    const id = v4(v4());
    const userCart = {
      id,
      userId,
      status: Status.OPEN
    };

    const res = await this.userCarts.save(userCart)

    return res;
  }

  async findOrCreateByUserId(userId: string): Promise<Carts> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

  async updateByUserId(userId: string, { cartItems }: Carts): Promise<Carts> {
    const { id, ...rest } = await this.findOrCreateByUserId(userId);
 
    const updatedCart = {
      id,
      ...rest,
      cartItems: [ ...cartItems ],
    }

    console.log('updatedCart', updatedCart);
    await this.userCarts.save(updatedCart);

    return { ...updatedCart };
  }

  async removeByUserId(userId: string): Promise<void> {
    await this.userCarts.delete({ userId })
  }

  async softRemoveByUserId(userId: string): Promise<void> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      await this.userCarts.update({ id: userCart.id}, { status: Status.ORDERED})
    }
  }
}
