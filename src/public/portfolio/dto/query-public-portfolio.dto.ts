// dto/query-public-portfolio.dto.ts
import { IsNumberString, IsOptional } from 'class-validator';

export class QueryPublicPortfolioDto {
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsNumberString()
  page?: string;
}
