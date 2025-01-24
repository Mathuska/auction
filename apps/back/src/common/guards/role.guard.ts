import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ExpressRequestInterface } from '../types/expressRequest.interface';

export class RolesGuard implements CanActivate {
  constructor(private readonly allowedRoles: string[]) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<ExpressRequestInterface>();

    if (!request.user || !request.user.role) {
      throw new HttpException(
        'User does not have access',
        HttpStatus.FORBIDDEN,
      );
    }

    const userRole = request.user.role;

    if (this.allowedRoles.includes(userRole)) {
      return true;
    }

    throw new HttpException('User does not have access', HttpStatus.FORBIDDEN);
  }
}

export const RolesGuardFactory = (roles: string[]) => new RolesGuard(roles);
