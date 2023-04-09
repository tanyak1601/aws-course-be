import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';

import { Orders } from '../entities';
import { CheckOutPayload } from '../models';
import { OrderStatus } from '../../shared';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Orders)
    private readonly userOrders: Repository<Orders>,
  ) {}


  async findById(orderId: string): Promise<Orders> {
    return this.userOrders.findOne({ where: { id: orderId }});
  }

  async create(data: CheckOutPayload): Promise<Orders> {
    const id = v4(v4())
    const order = {
      id,
      userId: data.userId,
      cartId: data.cartId,
      paymant: JSON.stringify(data.delivery),
      delivery: JSON.stringify(data.delivery),
      comments: data.comments,
      status: OrderStatus.IN_PROGRESS,
      total: data.total
    };
    console.log('order', order);
    
    const res = await this.userOrders.save(order)
    return res;
  }

  async update(orderId: string, data: Orders) {
    const order = await this.findById(orderId);

    if (!order) {
      throw new Error('Order does not exist.');
    }

    await this.userOrders.update({ id: orderId}, { ...data })
  }
}
