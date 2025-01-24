import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'John', description: 'First name of the user' })
  readonly first_name?: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  readonly last_name?: string;

  @ApiProperty({ example: '123' })
  readonly balance?: number;
}
