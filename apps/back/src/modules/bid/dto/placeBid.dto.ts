import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PlaceBidDto {
  @ApiProperty({
    example: '',
  })
  @IsNotEmpty()
  readonly auction_id: string;

  @ApiPropertyOptional({
    example: 100,
  })
  readonly amount: number;
}
