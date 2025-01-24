import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { typeOrmConfig } from '../config/orm.config';

@Module({
  imports: [TypeOrmModule.forRootAsync(typeOrmConfig)],
})
export class DatabaseModule {}
