import { ApiProperty } from '@nestjs/swagger';
import { Categories } from '../Categories/Categories.entity';
import { OrderDetails } from '../OrderDetails/OrderDetails.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'product' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'ID del producto de tipo UUID. Autogenerado.',
    example: '6e145d99-22c6-468f-abc5-7d7b8f3ad572',
  })
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  @ApiProperty({
    description:
      'Nombre del producto. Es de tipo varchar, con una longitud máxima de 50 caracteres y no puede ser nulo.',
    example: 'Camiseta Nike',
  })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  @ApiProperty({
    description:
      'Descripción del producto. Es de tipo varchar y no puede ser nulo.',
    example:
      'Camiseta de deporte Nike, color azul, disponible en varias tallas.',
  })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  @ApiProperty({
    description:
      'Precio del producto. Es de tipo decimal con una precisión máxima de 10 dígitos y 2 decimales.',
    example: 49.99,
  })
  price: number;

  @Column({ type: 'int', nullable: false })
  @ApiProperty({
    description: 'Stock del producto. Es de tipo entero y no puede ser nulo.',
    example: 100,
  })
  stock: number;

  @Column({ type: 'text', default: '../utils/imgDefault.jgp' })
  @ApiProperty({
    description:
      'URL de la imagen del producto. Es de tipo texto. Si no se especifica, se asigna una imagen por defecto.',
    example: 'https://example.com/images/product.jpg',
  })
  imgUrl: string;

  @ManyToOne(() => Categories, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  @ApiProperty({
    description:
      'Categoría a la que pertenece el producto. Relación de muchos a uno con la entidad Categories.',
    example: {
      id: '7d8e8b2c-48f2-43f9-bcb1-76c9d76a7811',
      name: 'Electrónica',
    },
  })
  categories: Categories;

  @ApiProperty({
    description:
      'Detalles de las órdenes asociadas al producto. Relación de muchos a muchos con la entidad OrderDetails.',
    example: [
      {
        id: '3d5b2c7e-89a8-45f8-bdde-123f46af8e72',
        total: '100.00',
        products: [
          {
            id: '27d7c6de-882d-4885-b6ac-1a136180f0ba',
            name: 'Samsung Odyssey G9',
            description: 'The best monitor in the world',
            price: '299.99',
            stock: 9,
            imgUrl: '../utils/imgDefault.jgp',
          },
        ],
      },
    ],
  })
  @ManyToMany(() => OrderDetails, (orderDetails) => orderDetails.products)
  orderDetails: OrderDetails[];
}
