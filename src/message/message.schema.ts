// // messages/schemas/message.schema.ts
// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document, Types } from 'mongoose';

// @Schema({ timestamps: true })
// export class Message extends Document {
//   @Prop({ type: Types.ObjectId, ref: 'User', required: true })
//   sender: Types.ObjectId;

//   @Prop({ type: Types.ObjectId, ref: 'Group', required: true })
//   group: Types.ObjectId;

//   @Prop({ required: true })
//   content: string;

//   @Prop({ type: [String], default: [] })
//   attachments: string[];

//   @Prop({ type: String, enum: ['text', 'image', 'document'], default: 'text' })
//   type: string;
// }

// export const MessageSchema = SchemaFactory.createForClass(Message);

// messages/schemas/message.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sender: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Group', required: true })
  group: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [String], default: [] })
  attachments: string[]; // URLs or file references for media

  @Prop({ type: String, enum: ['text', 'image', 'document', 'video', 'audio'], default: 'text' })
  type: 'text' | 'image' | 'document' | 'video' | 'audio'; // Added 'video' and 'audio'
}

export const MessageSchema = SchemaFactory.createForClass(Message);
