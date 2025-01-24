import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { EventEntity } from 'src/modules/event/entity/event.entity';
import { EventService } from 'src/modules/event/event.service';
import { UserView } from 'src/modules/user/entity/user.view.entity';
import { UserService } from 'src/modules/user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventEntity, UserView]),
    JwtModule.register({
      global: true,
      secret: 'Init1736951529278',
      signOptions: { expiresIn: '10d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, EventService, UserService],
})
export class AuthModule {}
