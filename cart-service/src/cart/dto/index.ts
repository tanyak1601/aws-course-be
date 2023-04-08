import { IsString, IsNumber } from 'class-validator';

export class CartItemDto {
  @IsString()
  cartId: string;

  @IsString()
  productId: string;

  @IsNumber()
  count: number;
}