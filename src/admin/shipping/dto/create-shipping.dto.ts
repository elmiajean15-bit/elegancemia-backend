import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from "class-validator";
import { Currency, ShippingZone } from "../../../../generated/prisma/enums";

export class CreateShippingDto {
  @IsString()
  name: string;

  @IsEnum(ShippingZone)
  zone: ShippingZone;

  // ✅ obligatoire SI national
  @ValidateIf((o) => o.zone === "national")
  @IsNotEmpty({ message: "La ville est obligatoire pour une livraison nationale" })
  @IsString()
  city: string;

  @IsNumber()
  price: number;

  @IsEnum(Currency)
  currency: Currency;

  @IsNumber()
  estimatedDays: number;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}