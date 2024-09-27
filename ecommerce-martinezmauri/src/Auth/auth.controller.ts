import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../dto/LoginUserDto';
import { CreateUserDto } from '../dto/CreateUserDto';
import { User } from 'src/Users/User.entity';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Login del usuario.',
    description: "Este endpoint permite hacer el 'login' en la aplicación.",
  })
  @ApiBody({
    description: 'Datos para iniciar sesión.',
    type: LoginUserDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Mensaje de user logged in successfully y token.',
  })
  @ApiResponse({
    status: 400,
    description: 'Usuario y/o contraseña incorrecta',
  })
  @HttpCode(200)
  @Post('signin')
  async signIn(@Body() loginDto: LoginUserDto): Promise<{
    success: string;
    token: string;
  }> {
    const result = await this.authService.signIn(loginDto);
    return result;
  }

  @ApiOperation({
    summary: 'Registro de un nuevo usuario.',
    description:
      'Este endpoint permite crear un nuevo usuario en la aplicación.',
  })
  @ApiBody({
    description:
      'Datos para la creación de usuario. Deben ser de tipo CreateUserDto.',
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado sin contraseña.',
  })
  @ApiResponse({
    status: 400,
    description: 'Su correo ya tiene una cuenta creada.',
  })
  @ApiResponse({
    status: 400,
    description: 'Las contraseñas no coinciden.',
  })
  @ApiResponse({ status: 400, description: 'Error interno.' })
  @HttpCode(201)
  @Post('signup')
  async signUp(@Body() createUser: CreateUserDto): Promise<Partial<User>> {
    return this.authService.signUp(createUser);
  }
}
