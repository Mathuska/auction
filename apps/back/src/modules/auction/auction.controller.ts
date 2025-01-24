import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RolesGuardFactory } from 'src/common/guards/role.guard';
import { OpenAuctionDto } from './dto/openAuction.dto';
import { AuctionView } from './entity/auction.view.entity';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('auction')
@ApiTags('auctions')
@ApiBearerAuth()
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Post('open')
  @UseGuards(RolesGuardFactory(['admin', 'employee']))
  @ApiOperation({ summary: 'Open auction' })
  async openAuction(
    @Body() openAuctionDto: OpenAuctionDto,
  ): Promise<AuctionView> {
    return await this.auctionService.openAuction(openAuctionDto);
  }

  @Post('close/:id')
  @UseGuards(RolesGuardFactory(['admin', 'employee']))
  @ApiOperation({ summary: 'Close auction' })
  async closeAuction(@Param('id') auctionId: string): Promise<AuctionView> {
    return await this.auctionService.closeAuction(auctionId);
  }

  @Get('')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all auctions' })
  async getAllAuctions(): Promise<AuctionView[]> {
    return await this.auctionService.getAllAuctions();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all auctions' })
  async getAuctionDetail(@Param('id') auctionId: string): Promise<AuctionView> {
    return await this.auctionService.getAuctionDetail(auctionId);
  }
}
