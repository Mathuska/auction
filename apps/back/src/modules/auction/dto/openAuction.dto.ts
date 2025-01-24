import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OpenAuctionDto {
  @ApiProperty({ example: '2025-02-20T14:31:06.246Z' })
  @IsNotEmpty()
  readonly end_time: Date;

  @ApiProperty({ example: '' })
  @IsNotEmpty()
  readonly product_id: string;
}
