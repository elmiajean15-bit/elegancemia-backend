import { ClientGender } from 'generated/prisma/enums';

export class SignupDto {
  name: string;

  email: string;

  phone: string;

  city: string;

  gender: ClientGender;

  password: string;
}
