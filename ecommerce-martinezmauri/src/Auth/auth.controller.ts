import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../dto/LoginUserDto';
import { CreateUserDto } from '../dto/CreateUserDto';
import { User } from 'src/Users/User.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signIn(@Body() loginDto: LoginUserDto): Promise<{
    success: string;
    token: string;
  }> {
    try {
      const result = await this.authService.signIn(loginDto);
      return result;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error interno.', error.message);
    }
  }

  @HttpCode(201)
  @Post('signup')
  async signUp(@Body() createUser: CreateUserDto): Promise<Partial<User>> {
    try {
      return this.authService.signUp(createUser);
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error interno.', error.message);
    }
  }
}
