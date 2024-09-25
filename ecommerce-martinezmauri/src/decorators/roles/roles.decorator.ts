import { SetMetadata } from '@nestjs/common';
import { Role } from '../../Auth/enum/roles.enum';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
