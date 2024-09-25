import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../Auth/guards/AuthGuard';
import { CreateUserDto } from '../dto/CreateUserDto';
import { Roles } from '../decorators/roles/roles.decorator';
import { Role } from '../Auth/enum/roles.enum';
import { RoleGuard } from '../Auth/guards/RoleGuard';
import { User } from './User.entity';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @HttpCode(200)
  @Get()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  async getUsers(
    @Query('limit') limit = 5,
    @Query('page') page = 1,
    @Request() req,
  ): Promise<{
    users: Omit<User, 'password'>[];
    exp: Date;
  }> {
    const users = await this.usersService.getUsers(Number(limit), Number(page));
    return { users, exp: req.user?.exp };
  }

  @ApiBearerAuth()
  @HttpCode(200)
  @Get(':id')
  @UseGuards(AuthGuard)
  async getUserById(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
  ): Promise<{ user: Partial<User>; exp: Date }> {
    const user = await this.usersService.getUsersById(id);
    return { user, exp: req.user.exp };
  }

  @ApiBearerAuth()
  @HttpCode(200)
  @Put(':id')
  @ApiBody({
    description:
      'Datos parciales para actualizar el usuario. Puede incluir uno o más campos del DTO CreateUserDto.',
    type: CreateUserDto,
  })
  @UseGuards(AuthGuard)
  async updateUserByid(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() user: Partial<CreateUserDto>,
    @Request() req,
  ): Promise<{ updatedUser: Partial<User>; exp: Date }> {
    const updatedUser = await this.usersService.updateUserById(id, user);
    return { updatedUser, exp: req.user.exp };
  }

  @ApiBearerAuth()
  @HttpCode(200)
  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteUserById(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
  ): Promise<{ deletedUser: string; exp: Date }> {
    const deletedUser = await this.usersService.deleteUserById(id);
    return { deletedUser, exp: req.user.exp };
  }
}
