import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../user/user.schema';

export type AuditTrailDocument = AuditTrail & Document;

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  ACCESS = 'ACCESS',
}

@Schema({ timestamps: true })
export class AuditTrail extends Document {
  @Prop({ required: true, enum: AuditAction })
  action: AuditAction; // Defines clear action types

  @Prop({ required: true })
  module: string; // Example: 'User', 'Material', 'Order'

  @Prop()
  documentId?: string; // ID of affected document

  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) 
  user: Types.ObjectId | User; // Store User object reference

  @Prop({ type: Object })
  changes?: Record<string, any>; // Stores changes for updates

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop()
  ipAddress?: string; // Captures user's IP

  @Prop()
  userAgent?: string; // Captures browser/device details

  @Prop({ type: Object })
  requestDetails?: Record<string, any>; // Optional metadata like headers or query params
}

export const AuditTrailSchema = SchemaFactory.createForClass(AuditTrail);
