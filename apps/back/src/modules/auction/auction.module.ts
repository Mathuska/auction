import { forwardRef, Module } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { AuctionController } from './auction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventService } from '../event/event.service';
import { AuctionView } from './entity/auction.view.entity';
import { ProductService } from '../product/product.service';
import { BidModule } from '../bid/bid.module';
import { EventEntity } from '../event/entity/event.entity';
import { ProductView } from '../product/entity/product.view.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuctionView, EventEntity, ProductView]),
    forwardRef(() => BidModule),
  ],
  controllers: [AuctionController],
  providers: [AuctionService, EventService, ProductService],
  exports: [AuctionService],
})
export class AuctionModule {}
