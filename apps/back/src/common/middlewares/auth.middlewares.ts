import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Response } from 'express';
import { ExpressRequestInterface } from '../types/expressRequest.interface';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class AuthMiddlewares implements NestMiddleware {
  private readonly logger: Logger = new Logger(AuthMiddlewares.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async use(req: ExpressRequestInterface, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      return next();
    }

    const token = req.headers.authorization.split(' ')[1];

    try {
      const decode = await this.jwtService.verify(token, {
        secret: 'Init1736951529278',
      });

      const user = await this.userService.findUserById(decode.id);

      if (user) {
        req.user = user;
      } else {
        this.logger.error(`User with id: ${decode.id} not found`);
        req.user = null;
      }
    } catch (err) {
      console.log(err);

      req.user = null;
    }
    return next();
  }
}
