import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../../users/user.service';
import { USER_ROLE } from '../../users/interfaces/user.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly usersService: UserService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<USER_ROLE[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    const { id } = request.user;
    const user = await this.usersService.findOneById(id);

    return roles.some((role) => user.role.includes(role));
  }
}
