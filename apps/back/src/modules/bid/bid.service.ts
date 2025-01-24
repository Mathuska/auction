import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BidView } from './entity/bid.view.entity';
import { PlaceBidDto } from './dto/placeBid.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventService } from '../event/event.service';
import { UserService } from '../user/user.service';
import { AuctionStatus } from 'src/core/enums/AuctionStatus';
import { v4 as uuidv4 } from 'uuid';
import { EventType } from 'src/core/enums/EventType';
import { AggregatorType } from 'src/core/enums/AggregatorType';
import { AuctionService } from '../auction/auction.service';
import { EventEntity } from '../event/entity/event.entity';
import { UserView } from '../user/entity/user.view.entity';

@Injectable()
export class BidService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
    @InjectRepository(UserView)
    private readonly userRepository: Repository<UserView>,
    @InjectRepository(BidView)
    private readonly bidRepository: Repository<BidView>,
    private readonly eventService: EventService,
    private readonly userService: UserService,
    @Inject(forwardRef(() => AuctionService))
    private readonly auctionService: AuctionService,
  ) {}

  async placeBid(placeBidDto: PlaceBidDto, userId: string): Promise<BidView> {
    const auction = await this.auctionService.findAuctionById(
      placeBidDto.auction_id,
    );

    if (!auction) {
      throw new NotFoundException('Auction with this id not exist');
    }

    if (auction.status !== AuctionStatus.OPEN) {
      throw new BadRequestException('Auction is not started yet');
    }

    if (auction.end_time < new Date()) {
      throw new BadRequestException('The auction is over');
    }

    const user = await this.userService.findUserById(userId);

    if (!user) {
      throw new NotFoundException('User with this id not exist');
    }

    if (user.balance < placeBidDto.amount) {
      throw new BadRequestException('The user does not have enough balance');
    }

    const bit = {
      id: uuidv4(),
      auction_id: placeBidDto.auction_id,
      amount: placeBidDto.amount,
      bidder_id: userId,
      bid_time: new Date(),
    };

    await this.eventService.createEvent(
      EventType.BID_PLACED,
      AggregatorType.BID,
      bit,
    );
    return bit;
  }

  async getAllBids(
    auction_id: string,
  ): Promise<{ bid: BidView; user: UserView }[]> {
    const bids = await this.bidRepository.find({ where: { auction_id } });

    return await Promise.all(
      bids.map(async (bid) => {
        const user = await this.userService.findUserById(bid.bidder_id);
        return { bid, user };
      }),
    );
  }
}
