import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { EventEntity } from 'src/modules/event/entity/event.entity';
import { UserView } from 'src/modules/user/entity/user.view.entity';
import { ProductView } from 'src/modules/product/entity/product.view.entity';
import { BidView } from 'src/modules/bid/entity/bid.view.entity';
import { AuctionView } from 'src/modules/auction/entity/auction.view.entity';

config();
export const AppDataSource: DataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  schema: process.env.DATABASE_SCHEMA,
  synchronize: false,
  migrationsRun: true,
  entities: [EventEntity, UserView, ProductView, BidView, AuctionView],
  migrations: [__dirname + '/../migrations/*.{ts,js}'],
});
