import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @ApiProperty({
    description:
      'Nombre del producto. Debe tener una longitud máxima de 50 caracteres.',
    example: 'Camiseta Deportiva',
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Descripción del producto. No tiene restricción de longitud.',
    example:
      'Camiseta deportiva de alta calidad, perfecta para cualquier actividad física.',
  })
  description: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @ApiProperty({
    description:
      'Precio del producto. Debe ser un número positivo y con un máximo de 2 decimales.',
    example: 29.99,
  })
  price: number;

  @IsInt()
  @IsPositive()
  @ApiProperty({
    description: 'Stock del producto. Debe ser un número positivo.',
    example: 100,
  })
  stock: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description:
      'Imagen del producto. Es una propiedad opcional. Si no se asigna una imagen, se cargará una por defecto.',
    example: 'camiseta-deportiva.jpg',
    default: 'imgDefault.jpg',
  })
  imgUrl?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID de la categoría del producto. ',
    example: '2c9cba4e-04a8-4e4a-a723-4e0cb3fa483f',
  })
  category_id: string;
}
