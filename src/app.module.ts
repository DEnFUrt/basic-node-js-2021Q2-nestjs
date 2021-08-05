import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { BoardsModule } from './boards/boards.module';
import { TasksModule } from './tasks/tasks.module';
import { CryptoService } from './utils-crypto/crypto.service';
import { LoggingInterceptor } from './logger/logger.interceptor';
import { Streams } from './logger/streams';
import { ManMadeExceptionFilter } from './exception-filters/man-made-exception.filter';
import { UtilsModule } from './utils/utils.module';
import { AuthModule } from './auth/auth.module';
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
    UtilsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CryptoService,
    Streams,
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
