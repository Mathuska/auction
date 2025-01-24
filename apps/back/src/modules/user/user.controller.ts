import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserInterface } from './interfaces';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { User } from 'src/common/decorators/user.decorator';
import { UpdateUserDto } from './dto/updateUser.dto';

@Controller('user')
@ApiTags('users')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('update')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 201, description: 'User successfully updated' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @User('id') userId: string,
  ): Promise<UserInterface> {
    return await this.userService.updateUser(updateUserDto, userId);
  }

  @Post('delete')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 201, description: 'User successfully updated' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async deleteUser(@User('id') userId: string): Promise<UserInterface> {
    return await this.userService.deleteUser(userId);
  }
}
