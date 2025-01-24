import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventService } from '../event/event.service';
import { ProductService } from '../product/product.service';
import { AuctionView } from './entity/auction.view.entity';
import { ProductStatus } from 'src/core/enums/ProductStatus';
import { AuctionStatus } from 'src/core/enums/AuctionStatus';
import { OpenAuctionDto } from './dto/openAuction.dto';
import { EventType } from 'src/core/enums/EventType';
import { AggregatorType } from 'src/core/enums/AggregatorType';
import { Cron } from '@nestjs/schedule';
import { BidService } from '../bid/bid.service';
import { EventEntity } from '../event/entity/event.entity';
import { ProductView } from '../product/entity/product.view.entity';

@Injectable()
export class AuctionService {
  constructor(
    @InjectRepository(AuctionView)
    private readonly auctionRepository: Repository<AuctionView>,
    @InjectRepository(ProductView)
    private readonly productRepository: Repository<ProductView>,
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
    private readonly eventService: EventService,
    private readonly productService: ProductService,
    @Inject(forwardRef(() => BidService))
    private readonly bidService: BidService,
  ) {}

  async openAuction(openAuctionDto: OpenAuctionDto): Promise<AuctionView> {
    const product = await this.productService.findProductById(
      openAuctionDto.product_id,
    );

    if (!product) {
      throw new NotFoundException('Product with this id not exist');
    }

    if (product.status !== ProductStatus.VERIFIED) {
      throw new BadRequestException('This product is not verified');
    }

    const existingAuction = await this.auctionRepository.findOneBy({
      id: product.auction_id,
    });

    if (existingAuction) {
      throw new BadRequestException('Auction with this product already exist');
    }

    const auction = {
      id: product.auction_id,
      product_id: product.id,
      seller_id: product.seller_id,
      starting_price: product.start_price,
      ending_price: null,
      start_time: new Date(),
      updated_at: new Date(),
      status: AuctionStatus.OPEN,
      end_time: openAuctionDto.end_time,
    };

    await this.eventService.createEvent(
      EventType.AUCTION_STARTED,
      AggregatorType.AUCTION,
      auction,
    );

    return auction;
  }

  async closeAuction(auctionId: string): Promise<AuctionView> {
    const auction = await this.findAuctionById(auctionId);

    if (!auction) {
      throw new NotFoundException('auction with this id not exist');
    }

    if (auction.end_time < new Date()) {
      throw new NotFoundException('auction is closed');
    }

    const newAuction = {
      ...auction,
      ending_price: 100,
      status: AuctionStatus.CLOSED,
      updated_at: new Date(),
      end_time: new Date(),
    };

    await this.eventService.createEvent(
      EventType.AUCTION_ENDED,
      AggregatorType.AUCTION,
      newAuction,
    );

    return newAuction;
  }

  async findAuctionById(id: string): Promise<AuctionView | null> {
    const auction = await this.auctionRepository.findOneBy({ id });

    return auction ? auction : null;
  }

  async getAuctionDetail(auctionId): Promise<any> {
    const auction = await this.getAuctionById(auctionId);

    const product = await this.productService.getProductById(
      auction.product_id,
    );

    const bids = await this.bidService.getAllBids(auction.id);

    return {
      ...auction,
      product,
      bids,
    };
  }

  async getAllAuctions(): Promise<AuctionView[]> {
    return this.auctionRepository.find();
  }
  async getAuctionById(auctionId: string): Promise<AuctionView> {
    const auction = this.findAuctionById(auctionId);

    if (!auction) {
      throw new NotFoundException('auction with this id not exist');
    }

    return auction;
  }

  @Cron('*/60 * * * *')
  async closeExpiredAuctions() {
    const expiredAuctions = await this.auctionRepository.find({
      where: {
        status: AuctionStatus.OPEN,
        end_time: new Date(new Date().toISOString()),
      },
    });

    if (expiredAuctions.length === 0) {
      console.log('No expired auctions found.');
      return;
    }

    console.log(
      `Found ${expiredAuctions.length} expired auctions. Closing them...`,
    );

    for (const auction of expiredAuctions) {
      await this.closeAuction(auction.id);
    }

    console.log('Expired auctions closed successfully.');
  }
}
