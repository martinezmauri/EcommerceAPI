import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../Products/Product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'categories' })
export class Categories {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'ID de la categoría de tipo UUID. Autogenerado.',
    example: '7d8e8b2c-48f2-43f9-bcb1-76c9d76a7811',
  })
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  @ApiProperty({
    description:
      'Nombre de la categoría. Es de tipo varchar, con una longitud máxima de 50 caracteres y no puede ser nulo.',
    example: 'keyboard',
  })
  name: string;

  @OneToMany(() => Product, (product) => product.categories)
  @JoinColumn({ name: 'product_id' })
  @ApiProperty({
    description:
      'Lista de productos asociados a esta categoría. Relación de uno a muchos con la entidad Product.',
    example: [
      {
        name: 'Iphone 15',
        description: 'The best smartphone in the world',
        price: 199.99,
        stock: 12,
        category: 'smartphone',
      },
    ],
  })
  products: Product[];
}
