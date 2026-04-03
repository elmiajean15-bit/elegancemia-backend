// dto/update-admin-profile.dto.ts
import { IsOptional, IsString } from "class-validator";

export class UpdateAdminProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}