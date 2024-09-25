import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './User.entity';

@Injectable()
export class UsersService {
  constructor(private userRepository: UsersRepository) {}

  async getUsers(
    limit: number,
    page: number,
  ): Promise<Omit<User, 'password'>[]> {
    const start = (page - 1) * limit;
    const end = start + limit;
    const users = await this.userRepository.getUsers();
    return users.slice(start, end);
  }

  async getUsersById(id: string): Promise<Partial<User>> {
    return this.userRepository.getUserById(id);
  }

  async updateUserById(id: string, user: Partial<User>): Promise<string> {
    return this.userRepository.updateUserById(id, user);
  }

  async deleteUserById(id: string): Promise<string> {
    return this.userRepository.deleteUserById(id);
  }
}
