import { IsEmail, IsOptional, IsString, Matches, MaxLength, ValidateIf } from 'class-validator';

export class SubscribeDto {
  @ValidateIf((o) => !o.phone)
  @IsEmail({}, { message: 'Podaj poprawny adres email' })
  @IsOptional()
  @MaxLength(255)
  email?: string;

  @ValidateIf((o) => !o.email)
  @IsString()
  @IsOptional()
  @Matches(/^[+]?[\d\s-]{9,}$/, { message: 'Podaj poprawny numer telefonu' })
  @MaxLength(32)
  phone?: string;

  @IsString()
  @MaxLength(32)
  matchId: string;
}
