import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MaterialStatus, Semester, MaterialType, AcademicLevel } from '../materials/dto/create-materials.dto'; // Import enums

export type MaterialDocument = Material & Document;

@Schema()
export class Material {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false })
  comment?: string;

  @Prop({ required: true })
  fileUrl: string;

  @Prop({ type: String, enum: MaterialStatus, default: MaterialStatus.PENDING })
  status: MaterialStatus;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) // Reference to the User model
  user: Types.ObjectId;

  @Prop({ type: String, enum: AcademicLevel, required: true })
  academicLevel: AcademicLevel

  @Prop({ type: String, enum: Semester, required: true })
  semester: Semester;

  @Prop({ type: String, enum: MaterialType, required: true })
  materialType: MaterialType;
}

export const MaterialSchema = SchemaFactory.createForClass(Material);
