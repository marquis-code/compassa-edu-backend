// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document, Types } from 'mongoose';

// // Interface for the `readBy` field
// export interface ReadBy {
//   user: Types.ObjectId; // Reference to the user who read the message
//   readAt: Date; // Timestamp when the message was read
// }

// // Interface for populated `readBy` field
// export interface ReadByPopulated {
//   user: { _id: Types.ObjectId; username: string; email: string }; // Populated user details
//   readAt: Date; // Timestamp when the message was read
// }

// // Interface for populated Message document
// export interface MessagePopulated extends Document {
//   sender: { _id: Types.ObjectId; username: string; email: string }; // Populated sender details
//   group: Types.ObjectId; // Reference to the group
//   content: string; // Message content
//   attachments: string[]; // Array of attachments
//   type: 'text' | 'image' | 'document' | 'video' | 'audio'; // Message type
//   readBy: ReadByPopulated[]; // Populated readBy details
//   createdAt: Date; // Creation timestamp
//   updatedAt: Date; // Update timestamp
// }

// @Schema({ timestamps: true })
// export class Message extends Document {
//   @Prop({ type: Types.ObjectId, ref: 'User', required: true })
//   sender: Types.ObjectId; // Reference to the user who sent the message

//   @Prop({ type: Types.ObjectId, ref: 'Group', required: true })
//   group: Types.ObjectId; // Reference to the group the message belongs to

//   @Prop({ default: "" })
//   content: string; // Message content

//   @Prop({ type: [String], default: [] })
//   attachments: string[]; // Array of file URLs or references for media

//   @Prop({ type: String, enum: ['text', 'image', 'document', 'video', 'audio'], default: 'text' })
//   type: 'text' | 'image' | 'document' | 'video' | 'audio'; // Message type (text, image, etc.)

//   @Prop({
//     type: [
//       {
//         user: { type: Types.ObjectId, ref: 'User' }, // Reference to the user who read the message
//         readAt: { type: Date }, // Timestamp when the message was read
//       },
//     ],
//     default: [],
//   })
//   readBy: ReadBy[]; // Array of objects tracking users who read the message
// }

// export const MessageSchema = SchemaFactory.createForClass(Message);


import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Interface for the `readBy` field
export interface ReadBy {
  user: Types.ObjectId; // Reference to the user who read the message
  readAt: Date; // Timestamp when the message was read
}

// Interface for populated `readBy` field
export interface ReadByPopulated {
  user: { _id: Types.ObjectId; username: string; email: string }; // Populated user details
  readAt: Date; // Timestamp when the message was read
}

// Interface for populated Message document
export interface MessagePopulated extends Document {
  sender: { _id: Types.ObjectId; username: string; email: string }; // Populated sender details
  group: Types.ObjectId; // Reference to the group
  content?: string; // Message content (optional)
  attachments: string[]; // Array of attachments
  type: 'text' | 'image' | 'document' | 'video' | 'audio'; // Message type
  readBy: ReadByPopulated[]; // Populated readBy details
  createdAt: Date; // Creation timestamp
  updatedAt: Date; // Update timestamp
}

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sender: Types.ObjectId; // Reference to the user who sent the message

  @Prop({ type: Types.ObjectId, ref: 'Group', required: true })
  group: Types.ObjectId; // Reference to the group the message belongs to

  @Prop({ default: undefined })
  content?: string; // Message content (optional)

  @Prop({ type: [String], default: [] })
  attachments: string[]; // Array of file URLs or references for media

  @Prop({ type: String, enum: ['text', 'image', 'document', 'video', 'audio'], default: 'text' })
  type: 'text' | 'image' | 'document' | 'video' | 'audio'; // Message type (text, image, etc.)

  @Prop({
    type: [
      {
        user: { type: Types.ObjectId, ref: 'User' }, // Reference to the user who read the message
        readAt: { type: Date }, // Timestamp when the message was read
      },
    ],
    default: [],
  })
  readBy: ReadBy[]; // Array of objects tracking users who read the message
}

export const MessageSchema = SchemaFactory.createForClass(Message);
