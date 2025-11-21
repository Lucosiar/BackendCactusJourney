import { PartialType } from '@nestjs/mapped-types';

import { CreateCactusDto } from './create-cactus.dto';

export class UpdateCactusDto extends PartialType(CreateCactusDto) {}
