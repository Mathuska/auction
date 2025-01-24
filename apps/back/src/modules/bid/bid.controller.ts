import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { BidService } from './bid.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { BidView } from './entity/bid.view.entity';
import { PlaceBidDto } from './dto/placeBid.dto';
import { User } from 'src/common/decorators/user.decorator';
import { UserView } from '../user/entity/user.view.entity';

@Controller('bid')
@ApiTags('bids')
@ApiBearerAuth()
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @Post('')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create product' })
  async placeBid(
    @Body() placeBidDto: PlaceBidDto,
    @User('id') userId: string,
  ): Promise<BidView> {
    return await this.bidService.placeBid(placeBidDto, userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all bids' })
  async getAllBids(
    @Param('id') auctionId: string,
  ): Promise<{ bid: BidView; user: UserView }[]> {
    return await this.bidService.getAllBids(auctionId);
  }
}
