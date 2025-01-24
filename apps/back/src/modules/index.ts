import { AuthModule } from 'src/core/auth/auth.module';
import { AuctionModule } from './auction/auction.module';
import { BidModule } from './bid/bid.module';
import { EventModule } from './event/event.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';

export const ApplicationModules = [
  AuthModule,
  UserModule,
  BidModule,
  ProductModule,
  AuctionModule,
  EventModule,
];
