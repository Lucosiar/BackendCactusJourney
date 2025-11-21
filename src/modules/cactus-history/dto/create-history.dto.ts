import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateHistoryDto {
  @IsOptional()
  @IsUrl()
  photoUrl?: string;

  @IsOptional()
  @IsString()
  comment?: string;
}
