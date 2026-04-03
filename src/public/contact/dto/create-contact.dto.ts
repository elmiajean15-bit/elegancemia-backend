import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from "class-validator";
import { ContactSubject } from "generated/prisma/enums";

export class CreateContactDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsEnum(ContactSubject)
  subject: ContactSubject;

  @IsString()
  @MinLength(10)
  message: string;
}