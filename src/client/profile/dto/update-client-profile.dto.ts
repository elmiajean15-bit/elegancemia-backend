// dto/update-client-profile.dto.ts
import { IsOptional, IsString } from "class-validator";
import { ClientGender } from "generated/prisma/enums";

export class UpdateClientProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  gender?: ClientGender;
}