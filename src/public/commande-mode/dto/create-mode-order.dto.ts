import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateModeOrderDto {
  // FRONT FLAG
  @IsBoolean()
  createAccount: boolean;

  // AUTH
  @IsOptional()
  @IsString()
  password?: string;

  // CLIENT INFO
  @IsString() nom: string;
  @IsString() email: string;
  @IsString() telephone: string;
  @IsString() ville: string;
  @IsString() pays: string;
  @IsOptional() @IsString() source?: string;

  // CREATION
  @IsString() type: string;
  @IsString() genre: string;
  @IsString() pieces: string;
  @IsString() occasion: string;

  // STYLE
  @IsString() style: string;
  @IsString() couleur: string;
  @IsString() matiere: string;
  @IsString() complexite: string;
  @IsString() inspiration: string;

  // TECH
  @IsString() taille: string;
  @IsString() morphologie: string;
  @IsString() finitions: string;
  @IsString() accessoires: string;
  @IsString() essayage: string;

  // BUSINESS
  @IsString() budget: string;
  @IsString() delai: string;
  @IsString() livraison: string;
}
