import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MaterialDocument = Material & Document;

@Schema()
export class Material {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  fileUrl: string;

  @Prop({ default: 'pending' })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) // Reference to the User model
  user: Types.ObjectId;

  @Prop({ required: true })
  academicLevel: string;

  @Prop({ required: true })
  semester: string;

  @Prop({ required: true })
  materialType: string;
}

export const MaterialSchema = SchemaFactory.createForClass(Material);
