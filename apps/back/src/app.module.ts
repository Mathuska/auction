import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ApplicationModules } from './modules';
import { DatabaseModule } from './core/database/database.module';
import { AuthMiddlewares } from './common/middlewares/auth.middlewares';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [DatabaseModule, ...ApplicationModules, ScheduleModule.forRoot()],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddlewares).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
