// groups/schemas/group.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Group extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: 'public' })
  status: 'public' | 'private';

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  creator: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  members: Types.ObjectId[];
}

export const GroupSchema = SchemaFactory.createForClass(Group);