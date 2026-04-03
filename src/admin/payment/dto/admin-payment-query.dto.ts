// admin/dto/admin-payment-query.dto.ts
import { IsOptional, IsString, IsNumberString } from "class-validator";

export class AdminPaymentQueryDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  method?: string;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}