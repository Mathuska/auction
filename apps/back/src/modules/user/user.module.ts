import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventService } from '../event/event.service';
import { UserView } from './entity/user.view.entity';
import { EventEntity } from '../event/entity/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserView, EventEntity])],
  controllers: [UserController],
  providers: [UserService, EventService],
  exports: [UserService],
})
export class UserModule {}
