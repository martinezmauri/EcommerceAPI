import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './User.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from '../dto/UpdateUserDto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getUsers(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepository.find();
    return users.map(
      ({ password, ...userWithoutPassword }) => userWithoutPassword,
    );
  }

  async getUserById(id: string): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('El usuario no existe.');
    }
    const { password, isAdmin, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }

  async createUser(user: Partial<User>): Promise<Partial<User> & User> {
    const createdUser = await this.userRepository.save(user);
    return createdUser;
  }

  async updateUserById(id: string, user: UpdateUserDto): Promise<string> {
    const existingUser = await this.userRepository.findOne({ where: { id } });

    if (!existingUser) {
      throw new NotFoundException(`El usuario no existe.`);
    }

    if (user.password) {
      const passwordHashed = await bcrypt.hash(user.password, 10);
      if (!passwordHashed) {
        throw new BadRequestException('Error interno.');
      }
      user.password = passwordHashed;
    }
    const updatedUser = await this.userRepository.merge(existingUser, user);

    await this.userRepository.save(updatedUser);

    return updatedUser.id;
  }

  async deleteUserById(id: string): Promise<string> {
    const result = await this.userRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`El usuario no existe.`);
    }
    return id;
  }
}
