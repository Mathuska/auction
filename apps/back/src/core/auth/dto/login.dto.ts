import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'Email address of the user',
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiPropertyOptional({
    example: 'secure_password',
    description: 'Password of the user',
  })
  readonly password: string;
}
