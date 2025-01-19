// import { IsString, IsArray, IsOptional, IsEnum } from 'class-validator';
// import { Types } from 'mongoose';

// export class CreateMessageDto {
//   @IsString()
//   content: string;

//   @IsString()
//   group: Types.ObjectId;

//   @IsOptional()
//   @IsArray()
//   attachments?: string[];

//   @IsOptional()
//   @IsEnum(['text', 'image', 'document'])
//   type?: string;
// }

// messages/dto/message.dto.ts
import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  content: string;

  @IsString()
  group: string;

  @IsOptional()
  @IsArray()
  attachments?: string[]; // Array of file URLs or references

  @IsOptional()
  @IsEnum(['text', 'image', 'document', 'video', 'audio']) // Added 'video' and 'audio'
  type?: 'text' | 'image' | 'document' | 'video' | 'audio';
}
