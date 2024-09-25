import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description:
      'Email de inicio de sesión. Debe ser un email válido y estar en formato de email.',
    example: 'example@gmail.com',
  })
  email: string;

  @IsNotEmpty()
  @Length(8, 15)
  @ApiProperty({
    description:
      'Contraseña de inicio de sesión. Debe tener una longitud mínima de 8 caracteres y una longitud máxima de 15 caracteres.',
    example: '123Example-',
  })
  password: string;
}
