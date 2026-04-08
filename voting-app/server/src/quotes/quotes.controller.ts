import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express-serve-static-core';
import { QuotesService } from './quotes.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Get()
  findAll() {
    return this.quotesService.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.quotesService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateQuoteDto) {
    return this.quotesService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateQuoteDto) {
    return this.quotesService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.quotesService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/vote')
  vote(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { sub: number; username: string },
  ) {
    return this.quotesService.vote(user.sub, id);
  }
}
