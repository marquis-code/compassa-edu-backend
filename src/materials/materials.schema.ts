import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MaterialStatus, Semester, MaterialType, AcademicLevel } from '../materials/dto/create-materials.dto'; // Import enums

export type MaterialDocument = Material & Document;
export type CategoryDocument = Category & Document;
export type SessionDocument = Session & Document;

@Schema({ timestamps: true }) // Automatically adds createdAt and updatedAt fields
export class Category {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description?: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

@Schema({ timestamps: true }) // Automatically Pls adds createdAt and updatedAt fields
export class Session {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description?: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);

@Schema()
export class Material {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false })
  comment?: string;

  @Prop({ type: [String], required: true }) // Allow multiple files or a single file
  fileUrls: string[];

  @Prop({ type: String, enum: MaterialStatus, default: MaterialStatus.PENDING })
  status: MaterialStatus;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) // Reference to the User model
  user: Types.ObjectId;

  @Prop({ type: String, enum: AcademicLevel, required: true })
  academicLevel: AcademicLevel;

  @Prop({ type: String, enum: Semester, required: true })
  semester: Semester;

  @Prop({ type: String, enum: MaterialType, required: true })
  materialType: MaterialType;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true }) // Reference to the Category model
  category: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Session', required: true }) // Reference to the Session model
  session: Types.ObjectId;
}

export const MaterialSchema = SchemaFactory.createForClass(Material);
