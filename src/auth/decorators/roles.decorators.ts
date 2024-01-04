import { SetMetadata } from '@nestjs/common';
import { USER_ROLE } from '../../users/interfaces/user.interface';

export const Roles = (...roles: USER_ROLE[]) => SetMetadata('roles', roles);
