import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Buy this car for me plz' })
  @IsNotEmpty()
  readonly description: string;

  @ApiProperty({ example: 'Car' })
  @IsNotEmpty()
  readonly product_type: string;

  @ApiProperty({
    example: 1000,
  })
  @IsNotEmpty()
  readonly start_price: number;
}
