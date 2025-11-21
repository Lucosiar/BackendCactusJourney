import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SaveTokenDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsOptional()
  platform?: string;
}
