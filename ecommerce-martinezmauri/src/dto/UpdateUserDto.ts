import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsStrongPassword,
  Length,
  MaxLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 80)
  @ApiProperty({
    description:
      'Nombre del usuario a actualizar. Debe tener una longitud mínima de 3 caracteres y una longitud máxima de 80 caracteres.',
    example: 'Nombre Apellido',
  })
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description:
      'Correo electrónico del usuario a actualizar. Debe ser un correo válido y estar en formato de email.',
    example: 'prueba@gmail.com',
  })
  email: string;

  @IsStrongPassword({
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minLength: 8,
  })
  @MaxLength(15)
  @ApiProperty({
    description:
      'Contraseña del usuario a actualizar. Debe tener una longitud mínima de 8 caracteres. También es obligatorio que contenga al menos 1 símbolo, 1 número, 1 letra mayúscula y 1 letra minúscula.',
    example: '123Prueba_',
  })
  password: string;

  @Length(3, 80)
  @ApiProperty({
    description:
      'Dirección del usuario a actualizar. Debe tener una longitud mínima de 3 caracteres y una longitud máxima de 80 caracteres. Incluye información como calle, número y detalles de ubicación.',
    example: '123 Calle Falsa, Departamento 4B, Ciudad, País',
  })
  address: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description:
      'Número de teléfono del usuario a actualizar. Debe ser un número, sin símbolos.',
    example: 2634123456,
  })
  phone: number;

  @Length(5, 20)
  @ApiProperty({
    description:
      'País del usuario a actualizar. Debe tener una longitud mínima de 5 caracteres y una longitud máxima de 20 caracteres.',
    example: 'Argentina',
  })
  country: string;

  @Length(5, 20)
  @ApiProperty({
    description:
      'Ciudad del usuario a actualizar. Debe tener una longitud mínima de 5 caracteres y una longitud máxima de 20 caracteres.',
    example: 'Mendoza',
  })
  city: string;
}
