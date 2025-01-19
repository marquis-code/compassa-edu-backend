// dto/group.dto.ts
import { IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsEnum(['public', 'private'])
  status?: 'public' | 'private';
}

export class UpdateGroupDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['public', 'private'])
  status?: 'public' | 'private';
}
