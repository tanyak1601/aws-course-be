import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { OrderStatus } from '../../shared';
import { Carts } from '../../cart/entities';

@Entity()
export class Orders {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'json' })
  paymant: string;

  @Column({ type: 'json' })
  delivery: string;

  @Column()
  comments: string;

  @Column({ type: 'enum', enum: OrderStatus })
  status: OrderStatus;

  @Column({ type: 'integer' })
  total: number;

  @OneToOne(() => Carts)
  @JoinColumn({name: 'cart_id', referencedColumnName: 'id'})
  cart_id: string
};
