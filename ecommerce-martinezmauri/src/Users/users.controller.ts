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
import { Roles } from '../decorators/roles/roles.decorator';
import { Role } from '../Auth/enum/roles.enum';
import { RoleGuard } from '../Auth/guards/RoleGuard';
import { User } from './User.entity';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUserDto } from '../dto/UpdateUserDto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Obtener la lista de usuarios',
    description:
      'Este endpoint permite obtener la lista de usuarios registrados. Puedes agregar Querys de page y limit para paginar los resultados. Necesita rol de administrador para ejecutarlo.',
  })
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
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

  @ApiOperation({
    summary: 'Obtener información de un usuario',
    description:
      'Este endpoint permite obtener información de un usuario buscado por su ID. Es necesario un token valido.',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado y tiempo de expiracion de token.',
  })
  @ApiResponse({ status: 404, description: 'El usuario no existe.' })
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

  @ApiOperation({
    summary: 'Actualizar información del usuario',
    description:
      'Este endpoint permite actualizar la información de un usuario buscado por ID. Es necesario un token valido.',
  })
  @ApiBody({
    description:
      'Datos para actualizar el usuario. Deben incluir los mismos campos que el DTO UpdateUserDto',
    type: UpdateUserDto,
  })
  @ApiResponse({
    status: 200,
    description: 'ID del usuario actualizado y tiempo de expiracion del token.',
  })
  @ApiResponse({ status: 404, description: 'El usuario no existe.' })
  @ApiResponse({ status: 400, description: 'Error interno.' })
  @ApiBearerAuth()
  @HttpCode(200)
  @Put(':id')
  @UseGuards(AuthGuard)
  async updateUserByid(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() user: UpdateUserDto,
    @Request() req,
  ): Promise<{ updatedUser: string; exp: Date }> {
    const updatedUser = await this.usersService.updateUserById(id, user);
    return { updatedUser, exp: req.user.exp };
  }

  @ApiOperation({
    summary: 'Borrar un usuario',
    description:
      'Este endpoint permite borrar la información de un usuario buscado por su ID. Es necesario un token valido.',
  })
  @ApiResponse({
    status: 200,
    description: 'ID del usuario eliminado y tiempo de expiracion del token.',
  })
  @ApiResponse({ status: 404, description: 'El usuario no existe.' })
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
