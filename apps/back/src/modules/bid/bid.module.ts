import { forwardRef, Module } from '@nestjs/common';
import { BidService } from './bid.service';
import { BidController } from './bid.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventService } from '../event/event.service';
import { UserService } from '../user/user.service';
import { BidView } from './entity/bid.view.entity';
import { AuctionModule } from '../auction/auction.module';
import { EventEntity } from '../event/entity/event.entity';
import { UserView } from '../user/entity/user.view.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BidView, EventEntity, UserView]),
    forwardRef(() => AuctionModule),
  ],
  controllers: [BidController],
  providers: [BidService, EventService, UserService],
  exports: [BidService],
})
export class BidModule {}
