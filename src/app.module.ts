import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/db.config';
import { BooksModule } from './books/books.module';
import { CheckoutsModule } from './checkouts/checkouts.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({ ...dataSourceOptions, autoLoadEntities: true }),
    ThrottlerModule.forRoot([
      //** config rate limit to any req to app */
      {
        ttl: 60000, //**the time to live in milliseconds */
        limit: 10, // ** the maximum number of requests */
      },
    ]),
    UserModule,
    AuthModule,
    BooksModule,
    CheckoutsModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    //**apply rate limit guard */
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
