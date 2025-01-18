import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class AuditTrail extends Document {
  @Prop({ required: true })
  action: string; // e.g., CREATE, UPDATE, DELETE

  @Prop({ required: true })
  module: string; // e.g., 'User', 'Material'

  @Prop()
  documentId: string; // The ID of the affected document

 @Prop({ type: Types.ObjectId, ref: 'User', required: true }) // Reference to the User model
  user: Types.ObjectId;

  @Prop()
  changes?: Record<string, any>; // Captures changes in case of updates

  @Prop()
  ipAddress?: string; // Optional: IP address of the user

  @Prop()
  timestamp?: Date; // Action time
}

export const AuditTrailSchema = SchemaFactory.createForClass(AuditTrail);
