import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quote } from '../entities/quote.entity';
import { Vote } from 'src/entities/vote.entity';
import { CreateQuoteDto } from './dto/create-quote.dto';

@Injectable()
export class QuotesRespository {
  constructor(
    @InjectRepository(Quote)
    private readonly quoteRepo: Repository<Quote>,
    @InjectRepository(Vote)
    private readonly voteRepo: Repository<Vote>,
  ) {}

  findAll(): Promise<Quote[]> {
    return this.quoteRepo.find();
  }

  findById(id: number): Promise<Quote | null> {
    return this.quoteRepo.findOne({ where: { id } });
  }

  create(dto: CreateQuoteDto): Promise<Quote> {
    const quote = this.quoteRepo.create(dto);
    return this.quoteRepo.save(quote);
  }

  update(quote: Quote, text: string): Promise<Quote> {
    quote.text = text;
    return this.quoteRepo.save(quote);
  }

  async delete(id: number): Promise<{ message: string }> {
    await this.voteRepo.delete({ quote: { id } });
    await this.quoteRepo.delete(id);
    return { message: `Quote #${id} deleted successfully` };
  }

  hasVoted(userId: number, quoteId: number): Promise<boolean> {
    return this.voteRepo
      .findOne({ where: { user: { id: userId }, quote: { id: quoteId } } })
      .then((vote) => !!vote);
  }

  async vote(userId: number, quote: Quote): Promise<Quote> {
    const newVote = this.voteRepo.create({
      user: { id: userId },
      quote: { id: quote.id },
    });
    await this.voteRepo.save(newVote);
    quote.voteCount += 1;
    return this.quoteRepo.save(quote);
  }
}
