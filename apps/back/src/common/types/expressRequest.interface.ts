import { Request } from 'express';
import { UserInterface } from 'src/modules/user/interfaces';

export interface ExpressRequestInterface extends Request {
  user?: UserInterface;
}
