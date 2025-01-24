import { IsNotEmpty, IsEmail, IsEnum } from 'class-validator';
import { UserRole } from 'src/core/enums/UserRole';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'John', description: 'First name of the user' })
  @IsNotEmpty()
  readonly first_name: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  @IsNotEmpty()
  readonly last_name: string;

  @ApiProperty({
    example: UserRole.CLIENT,
    enum: UserRole,
    description: 'Role of the user',
  })
  @IsNotEmpty()
  @IsEnum(UserRole)
  readonly role: UserRole;

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
