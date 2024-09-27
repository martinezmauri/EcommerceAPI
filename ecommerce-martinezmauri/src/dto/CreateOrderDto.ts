import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description:
      'ID del usuario que realiza el pedido. Debe ser un UUID válido de un usuario existente.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductIdDto)
  @ArrayMinSize(1)
  @ApiProperty({
    description:
      'Array de objetos con identificadores de productos. Cada identificador debe ser un UUID válido de un producto existente. El array debe contener al menos un identificador.',
    example: [{ id: '6e145d99-22c6-468f-abc5-7d7b8f3ad572' }],
  })
  products: ProductIdDto[];
}
class ProductIdDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'ID de un producto válido. Debe ser un UUID.',
    example: '6e145d99-22c6-468f-abc5-7d7b8f3ad572',
  })
  id: string;
}
