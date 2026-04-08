import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { QuotesRespository } from './quotes.repository';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';

@Injectable()
export class QuotesService {
  constructor(private readonly quotesRepo: QuotesRespository) {}

  findAll() {
    return this.quotesRepo.findAll();
  }

  async findById(id: number) {
    const quote = await this.quotesRepo.findById(id);
    if (!quote) throw new NotFoundException(`Quote #${id} not found`);
    return quote;
  }

  create(dto: CreateQuoteDto) {
    return this.quotesRepo.create(dto);
  }

  async update(id: number, dto: UpdateQuoteDto) {
    const quote = await this.findById(id);
    return this.quotesRepo.update(quote, dto.text!);
  }

  async delete(id: number): Promise<{ message: string }> {
    await this.findById(id);
    return this.quotesRepo.delete(id);
  }

  async vote(userId: number, quoteId: number) {
    const quote = await this.findById(quoteId);

    const alreadyVoted = await this.quotesRepo.hasVoted(userId, quoteId);
    if (alreadyVoted) throw new ForbiddenException('Already voted');

    return this.quotesRepo.vote(userId, quote);
  }
}
