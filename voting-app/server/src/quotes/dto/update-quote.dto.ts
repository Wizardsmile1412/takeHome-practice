import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class UpdateQuoteDto {
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(500)
  text?: string;
}
