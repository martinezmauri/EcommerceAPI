import { ApiProperty } from '@nestjs/swagger';
import { Orders } from '../Orders/Orders.entity';
import { Product } from '../Products/Product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'order_details' })
export class OrderDetails {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'ID de los detalles del pedido de tipo UUID. Autogenerado.',
    example: '9f2d4a8e-72f5-4e61-8d74-99b5f5b2f3a7',
  })
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  @ApiProperty({
    description:
      'Precio total del pedido. Es de tipo decimal con un máximo de 10 dígitos y 2 decimales.',
    example: 1599.99,
  })
  price: number;

  @OneToOne(() => Orders, (order) => order.orderDetail)
  @JoinColumn({ name: 'order_id' })
  @ApiProperty({
    description:
      'Relación uno a uno con la entidad Orders. Representa el pedido al que pertenecen estos detalles.',
    example: {
      id: 'b087294d-a167-4834-a8cf-3ccda6cb5c9b',
      date: '2024-09-18T12:45:30.000Z',
    },
  })
  order: Orders;

  @ManyToMany(() => Product)
  @JoinTable({ name: 'order_details_products' })
  @ApiProperty({
    description:
      'Lista de productos asociados a los detalles del pedido. Relación de muchos a muchos con la entidad Product.',
    example: [
      {
        id: '6e145d99-22c6-468f-abc5-7d7b8f3ad572',
        name: 'Smartphone Samsung Galaxy S21',
        price: 799.99,
      },
      {
        id: '5d2b7f5e-3c9d-4fb1-abb9-1a0f7a529f23',
        name: 'Smart TV LG 55"',
        price: 1299.99,
      },
    ],
  })
  products: Product[];
}
