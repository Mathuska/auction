import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventService } from '../event/event.service';
import { ProductView } from './entity/product.view.entity';
import { EventEntity } from '../event/entity/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductView, EventEntity])],
  controllers: [ProductController],
  providers: [ProductService, EventService],
  exports: [ProductService],
})
export class ProductModule {}
