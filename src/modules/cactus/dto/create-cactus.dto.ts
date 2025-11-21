import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';

export class CreateCactusDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsUrl()
  photoUrl?: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsBoolean()
  interior?: boolean;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsInt()
  avgTemp?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  avgHumidity?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  wateringFrequencyDays?: number;

  @IsOptional()
  @IsDateString()
  lastWateredAt?: string;
}
