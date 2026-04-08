import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './entities/user.entity';
import { Quote } from './entities/quote.entity';
import { Vote } from './entities/vote.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { QuotesModule } from './quotes/quotes.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'data/db.sqlite',
      entities: [User, Quote, Vote, RefreshToken],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    QuotesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
