import { PartialType } from '@nestjs/mapped-types';
import { CreateMaterialDto } from './create-materials.dto';

export class UpdateMaterialDto extends PartialType(CreateMaterialDto) {}
