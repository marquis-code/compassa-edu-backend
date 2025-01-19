// // dto/group.dto.ts
// import { IsString, IsOptional, IsEnum } from 'class-validator';

// export class CreateGroupDto {
//   @IsString()
//   name: string;

//   @IsString()
//   description: string;

//   @IsOptional()
//   @IsEnum(['public', 'private'])
//   status?: 'public' | 'private';
// }

// export class UpdateGroupDto {
//   @IsOptional()
//   @IsString()
//   name?: string;

//   @IsOptional()
//   @IsString()
//   description?: string;

//   @IsOptional()
//   @IsEnum(['public', 'private'])
//   status?: 'public' | 'private';
// }

// dto/group.dto.ts
import { IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['public', 'private'])
  @IsOptional()
  status?: 'public' | 'private';
}

export class UpdateGroupDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['public', 'private'])
  @IsOptional()
  status?: 'public' | 'private';
}