import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/CreateUserDto';
import { UsersRepository } from '../Users/users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from './enum/roles.enum';
import { User } from 'src/Users/User.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(loginDto): Promise<{
    success: string;
    token: string;
  }> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException('Usuario y/o contraseña incorrecta');
    }
    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      throw new BadRequestException('Usuario y/o contraseña incorrecta');
    }
    const roles = user.isAdmin ? Role.Admin : Role.User;
    const userPayload = {
      id: user.id,
      email: user.email,
      roles,
    };
    const token = this.jwtService.sign(userPayload);

    return { success: 'user logged in successfully', token };
  }

  async signUp(createUser: CreateUserDto): Promise<Partial<User>> {
    const foundUser = await this.userRepository.findUserByEmail(
      createUser.email,
    );
    if (foundUser) {
      throw new BadRequestException('Su correo ya tiene una cuenta creada.');
    }
    if (createUser.password !== createUser.confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden.');
    }
    const passwordHashed = await bcrypt.hash(createUser.password, 10);

    if (!passwordHashed) {
      throw new BadRequestException('Error interno.');
    }
    await this.userRepository.createUser({
      ...createUser,
      password: passwordHashed,
    });
    const { password, confirmPassword, ...userWithoutPassword } = createUser;
    return userWithoutPassword;
  }
}
