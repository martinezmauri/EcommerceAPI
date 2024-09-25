import { ApiProperty } from '@nestjs/swagger';
import { Orders } from '../Orders/Orders.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description:
      'ID del usuario de tipo UUID. Este valor es autogenerado por la base de datos.',
    example: '6e145d99-22c6-468f-abc5-7d7b8f3ad572',
  })
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  @ApiProperty({
    description:
      'Nombre del usuario. Es de tipo varchar con una longitud máxima de 50 caracteres. Este campo es obligatorio (no puede ser nulo).',
    example: 'Rodrigo',
  })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  @ApiProperty({
    description:
      'Email del usuario. Es de tipo varchar, con una longitud máxima de 50 caracteres. Este campo es obligatorio y único.',
    example: 'example@gmail.com',
  })
  email: string;

  @Column({ type: 'varchar', length: 60, nullable: false })
  @ApiProperty({
    description:
      'Contraseña del usuario. Es de tipo varchar y tiene una longitud máxima de 60 caracteres debido al almacenamiento de la contraseña hasheada. Este campo es obligatorio.',
    example: 'contraseñaHasheada123',
  })
  password: string;

  @Column({ type: 'bigint' })
  @ApiProperty({
    description:
      'Número de teléfono del usuario. Es de tipo bigint y no tiene restricciones de longitud.',
    example: 2634123567,
  })
  phone: number;

  @Column({ type: 'varchar', length: 50 })
  @ApiProperty({
    description:
      'País del usuario. Es de tipo varchar y tiene una longitud máxima de 50 caracteres.',
    example: 'Argentina',
  })
  country: string;

  @Column({ type: 'varchar' })
  @ApiProperty({
    description:
      'Dirección del usuario. Es de tipo varchar, donde se almacena la información completa de la dirección.',
    example: '123 Calle Falsa, Departamento 4B',
  })
  address: string;

  @Column({ type: 'varchar', length: 50 })
  @ApiProperty({
    description:
      'Ciudad del usuario. Es de tipo varchar y tiene una longitud máxima de 50 caracteres.',
    example: 'Buenos Aires',
  })
  city: string;

  @Column({ type: 'boolean', default: false })
  @ApiProperty({
    description:
      'Rol del usuario. Este valor es de tipo booleano, por defecto es "falso", lo que indica un rol de usuario normal. Si es verdadero, indica que tiene un rol de administrador.',
    example: false,
  })
  isAdmin: boolean;

  @OneToMany(() => Orders, (orders) => orders.user)
  @JoinColumn({ name: 'orders_id' })
  @ApiProperty({
    description:
      'Relación de uno a muchos con la entidad de órdenes (orders). Representa las órdenes asociadas a este usuario.',
    examples: [
      {
        id: '8e145d99-33c6-467f-bbc5-7d7b8f3ad672',
        date: '2024-09-18T15:45:00Z',
        orderDetail: {
          orderId: '8e145d99-33c6-467f-bbc5-7d7b8f3ad672',
          products: [
            { id: '6e145d99-22c6-468f-abc5-7d7b8f3ad572' },
            { id: '7f144d89-33d7-487f-bdc5-8c7b8f4ae671' },
          ],
        },
      },
    ],
  })
  orders: Orders[];
}
