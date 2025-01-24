import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInterface } from './interfaces';
import { UpdateUserDto } from './dto/updateUser.dto';
import { EventService } from '../event/event.service';
import { AggregatorType } from 'src/core/enums/AggregatorType';
import { EventType } from 'src/core/enums/EventType';
import { UserView } from './entity/user.view.entity';
import { EventEntity } from '../event/entity/event.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
    @InjectRepository(UserView)
    private readonly userViewRepository: Repository<UserView>,
    private readonly eventService: EventService,
  ) {}

  async updateUser(
    updateUserDto: UpdateUserDto,
    userId: string,
  ): Promise<UserInterface> {
    const user = await this.findUserById(userId);

    if (user.deleted_at) {
      throw new BadRequestException('User was deleted');
    }
    const updatedUser = {
      ...updateUserDto,
      updated_at: new Date(),
    };

    const newUser = Object.assign(user, updatedUser);

    await this.eventService.createEvent(
      EventType.USER_UPDATED,
      AggregatorType.USER,
      newUser,
    );

    delete user.password;
    return newUser;
  }

  async deleteUser(userId: string): Promise<UserInterface> {
    const user = await this.findUserById(userId);

    if (user.deleted_at) {
      throw new BadRequestException('User is already deleted');
    }

    const updatedUser = {
      updated_at: new Date(),
      deleted_at: new Date(),
    };

    const newUser = Object.assign(user, updatedUser);

    await this.eventService.createEvent(
      EventType.USER_DELETED,
      AggregatorType.USER,
      newUser,
    );

    delete user.password;
    return newUser;
  }

  async findUserByEmail(email: string): Promise<UserInterface | null> {
    const user = await this.userViewRepository.findOneBy({ email });

    return user ? user : null;
  }
  async findUserById(id: string): Promise<UserInterface | null> {
    const user = await this.userViewRepository.findOneBy({ id });

    return user ? user : null;
  }
}
