import { IsOptional, IsString, IsEnum } from 'class-validator';

export enum ClientGender {
  femme = 'femme',
  homme = 'homme',
  autre = 'autre',
}

export class UpdateClientDto {
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
  @IsEnum(ClientGender)
  gender?: ClientGender;

  @IsOptional()
  @IsString()
  avatar?: string;
}
