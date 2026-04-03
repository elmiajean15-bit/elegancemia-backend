// dto/update-client-password.dto.ts
import { IsString } from "class-validator";

export class UpdateClientPasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  newPassword: string;
}