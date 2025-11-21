import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { SecurityHeadersMiddleware } from './common/middleware/security-headers.middleware';
import { RateLimitMiddleware } from './common/middleware/rate-limit.middleware';
import { CorsMiddleware } from './common/middleware/cors.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CactusModule } from './modules/cactus/cactus.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { CactusHistoryModule } from './modules/cactus-history/cactus-history.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    PrismaModule,
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    CactusModule,
    UploadsModule,
    CactusHistoryModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorsMiddleware, SecurityHeadersMiddleware, RateLimitMiddleware)
      .forRoutes('*');
  }
}
