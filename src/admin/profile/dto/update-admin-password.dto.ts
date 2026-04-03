// dto/update-admin-password.dto.ts
import { IsString } from "class-validator";

export class UpdateAdminPasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  newPassword: string;
}