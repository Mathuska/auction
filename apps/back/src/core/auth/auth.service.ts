import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from 'src/modules/event/entity/event.entity';
import { Repository } from 'typeorm';
import { EventService } from 'src/modules/event/event.service';
import { AggregatorType } from '../enums/AggregatorType';
import { EventType } from '../enums/EventType';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UserInterface, RegisterResponse } from 'src/modules/user/interfaces';
import { LoginDto } from './dto/login.dto';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
    private readonly jwtService: JwtService,
    private readonly eventService: EventService,
    private readonly userService: UserService,
  ) {}

  async login(loginDto: LoginDto): Promise<RegisterResponse> {
    const existingUser = await this.userService.findUserByEmail(loginDto.email);

    if (!existingUser) {
      throw new BadRequestException('User with this email not exist');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      existingUser.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.issueTokenPair(existingUser);

    delete existingUser.password;
    return { user: existingUser, tokens };
  }

  async register(registerDto: RegisterDto): Promise<RegisterResponse> {
    const existingUser = await this.userService.findUserByEmail(
      registerDto.email,
    );

    if (existingUser) {
      throw new BadRequestException('This user is existing');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = {
      ...registerDto,
      id: uuidv4(),
      balance: 0,
      password: hashedPassword,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    };

    const newUser = await this.createUser(user);
    await this.eventRepository.save(newUser);

    const tokens = await this.issueTokenPair(user);

    delete user.password;
    return { user, tokens };
  }

  async createUser(user: UserInterface): Promise<EventEntity> {
    return await this.eventService.createEvent(
      EventType.USER_CREATED,
      AggregatorType.USER,
      user,
    );
  }

  async issueTokenPair(
    user: UserInterface,
  ): Promise<{ refreshToken: string; accessToken: string }> {
    const data = { id: user.id, email: user.email, role: user.role };
    const refreshToken = await this.jwtService.signAsync(data, {
      expiresIn: '15d',
    });

    const accessToken = await this.jwtService.signAsync(data, {
      expiresIn: '10d',
    });
    return { refreshToken, accessToken };
  }
}
