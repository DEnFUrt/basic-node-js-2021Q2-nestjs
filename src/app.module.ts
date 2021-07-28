import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { BoardsModule } from './boards/boards.module';
import { TasksModule } from './tasks/tasks.module';
import { AuthGuard } from './auth/auth.guard';
import { CryptoService } from './utils-crypto/crypto.service';
import { LoginModule } from './login/login.module';
import { LoggingInterceptor } from './logger/logger.interceptor';
import { Streams } from './logger/streams';
import { ManMadeExceptionFilter } from './exception-filters/man-made-exception.filter';
import { UtilsModule } from './utils/utils.module';
import config from './common/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(),
    UsersModule,
    BoardsModule,
    TasksModule,
    LoginModule,
    UtilsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CryptoService,
    Streams,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ManMadeExceptionFilter,
    },
  ],
})
export class AppModule {}
