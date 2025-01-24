import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { EventEntity } from 'src/modules/event/entity/event.entity';
import { config } from 'dotenv';
import { UserView } from 'src/modules/user/entity/user.view.entity';
import { ProductView } from 'src/modules/product/entity/product.view.entity';
import { BidView } from 'src/modules/bid/entity/bid.view.entity';
import { AuctionView } from 'src/modules/auction/entity/auction.view.entity';

config();
const postgresConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: configService.get<string>('DATABASE_HOST'),
    port: +configService.get<number>('DATABASE_PORT'),
    username: configService.get<string>('DATABASE_USER'),
    password: configService.get<string>('DATABASE_PASSWORD'),
    database: configService.get<string>('DATABASE_NAME'),
    schema: configService.get<string>('DATABASE_SCHEMA'),
    entities: [EventEntity, UserView, ProductView, BidView, AuctionView],
    migrations: [__dirname + '/../migrations/*.{ts,js}'],
    synchronize: false,
    migrationsRun: true,
  };
};

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],

  useFactory: (configService: ConfigService) => {
    return postgresConfig(configService);
  },
};
