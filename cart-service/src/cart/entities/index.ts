import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Status, CURRENT_TIMESTAMP } from '../../shared';

@Entity()
export class Carts {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @Column({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: string;

  @Column({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  updatedAt: string;

  @Column({ type: 'enum', enum: Status })
  status: Status;

  @OneToMany(() => CartItems, (cartItems) => cartItems.carts, { cascade: true })
  @JoinColumn({ name: 'id', referencedColumnName: 'cart_id' })
  cartItems: CartItems[]
};

@Entity()
export class CartItems {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  cartId: string;

  @Column({ type: 'uuid' })
  productId: string;

  @Column( { type: 'integer' })
  count: number;

  @ManyToOne(() => Carts, (carts) => carts.cartItems, { orphanedRowAction: 'delete', onDelete: 'CASCADE' })
  @JoinColumn({name: 'cart_id', referencedColumnName: 'id'})
  carts: Carts
};

