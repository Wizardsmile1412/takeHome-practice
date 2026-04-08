import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quote } from 'src/entities/quote.entity';
import { Vote } from 'src/entities/vote.entity';
import { QuotesRespository } from './quotes.repository';
import { QuotesService } from './quotes.service';
import { QuotesController } from './quotes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Quote, Vote])],
  providers: [QuotesRespository, QuotesService],
  controllers: [QuotesController],
})
export class QuotesModule {}
