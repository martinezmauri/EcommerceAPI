import { ApiProperty } from '@nestjs/swagger';
import { OrderDetails } from '../OrderDetails/OrderDetails.entity';
import { User } from '../Users/User.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'orders' })
export class Orders {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'ID de la orden de tipo UUID. Autogenerado.',
    example: '8e145d99-33c6-467f-bbc5-7d7b8f3ad672',
  })
  id: string;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({
    description:
      'Usuario asociado a la orden. Es una relación Many-to-One con la entidad User.',
    example: {
      id: 'b087294d-a167-4834-a8cf-3ccda6cb5c9b',
      name: 'Rodrigo Rosales',
      email: 'example@gmail.com',
    },
  })
  user: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    description:
      'Fecha y hora en la que se realizó la orden. Se asigna automáticamente al crear la orden.',
    example: '2024-09-18T15:45:00Z',
  })
  date: Date;

  @OneToOne(() => OrderDetails, (orderDetails) => orderDetails.order)
  @JoinColumn({ name: 'order_detail_id' })
  @ApiProperty({
    description:
      'Detalles de la orden asociados. Es una relación One-to-One con la entidad OrderDetails.',
    example: {
      orderId: '8e145d99-33c6-467f-bbc5-7d7b8f3ad672',
      products: [
        { id: '6e145d99-22c6-468f-abc5-7d7b8f3ad572' },
        { id: '7f144d89-33d7-487f-bdc5-8c7b8f4ae671' },
      ],
    },
  })
  orderDetail: OrderDetails;
}
