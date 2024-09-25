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

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 80)
  @ApiProperty({
    description:
      'Nombre del usuario. Debe tener una longitud mínima de 3 caracteres y una longitud máxima de 80 caracteres.',
    example: 'Rodrigo Rosales',
  })
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description:
      'Correo electrónico del usuario. Debe ser un correo válido y estar en formato de email.',
    example: 'example@gmail.com',
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
      'Contraseña del usuario. Debe tener una longitud mínima de 8 caracteres. También es obligatorio que contenga al menos 1 símbolo, 1 número, 1 letra mayúscula y 1 letra minúscula.',
    example: '123Example-',
  })
  password: string;

  @IsNotEmpty()
  @ApiProperty({
    description:
      'Contraseña de confirmación del usuario. Debe ser idéntica a la primera contraseña ingresada.',
    example: '123Example-',
  })
  confirmPassword: string;

  @Length(3, 80)
  @ApiProperty({
    description:
      'Dirección del usuario. Debe tener una longitud mínima de 3 caracteres y una longitud máxima de 80 caracteres. Incluye información como calle, número y detalles de ubicación.',
    example: '123 Calle Falsa, Departamento 4B, Ciudad, País',
  })
  address: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description:
      'Número de teléfono del usuario. Debe ser un número, sin símbolos.',
    example: 12345678,
  })
  phone: number;

  @Length(5, 20)
  @ApiProperty({
    description:
      'País del usuario. Debe tener una longitud mínima de 5 caracteres y una longitud máxima de 20 caracteres.',
    example: 'Argentina',
  })
  country: string;

  @Length(5, 20)
  @ApiProperty({
    description:
      'Ciudad del usuario. Debe tener una longitud mínima de 5 caracteres y una longitud máxima de 20 caracteres.',
    example: 'Buenos Aires',
  })
  city: string;

  @IsEmpty()
  @ApiProperty({
    description:
      'Rol del usuario. Es una propiedad opcional; por defecto es falso. El valor falso indica que tiene un rol de usuario y el valor verdadero indica que tiene un rol de admin.',
    example: false,
    default: false,
  })
  isAdmin?: boolean;
}
