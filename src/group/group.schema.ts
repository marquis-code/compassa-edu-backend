// // // // groups/schemas/group.schema.ts
// // // import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// // // import { Document, Types } from 'mongoose';

// // // @Schema({ timestamps: true })
// // // export class Group extends Document {
// // //   @Prop({ required: true })
// // //   name: string;

// // //   @Prop({ required: true })
// // //   description: string;

// // //   @Prop({ default: 'public' })
// // //   status: 'public' | 'private';

// // //   @Prop({ type: Types.ObjectId, ref: 'User', required: true })
// // //   creator: Types.ObjectId;

// // //   @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
// // //   members: Types.ObjectId[];

// // //     // New property to reference messages
// // //     @Prop({ type: [{ type: Types.ObjectId, ref: 'Message' }], default: [] })
// // //     messages: Types.ObjectId[];
// // // }

// // // export const GroupSchema = SchemaFactory.createForClass(Group);

// // import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// // import { Document, Types } from 'mongoose';

// // // Message interface for populated data
// // export interface MessagePopulated {
// //   _id: Types.ObjectId;
// //   content: string;
// //   type: 'text' | 'image' | 'document' | 'audio' | 'video';
// //   sender: {
// //     _id: Types.ObjectId;
// //     username: string;
// //     email: string;
// //   };
// //   attachments: string[];
// //   readBy: { user: Types.ObjectId; readAt: Date }[];
// //   createdAt: Date;
// //   updatedAt: Date;
// // }

// // // Group interface
// // export interface Group extends Document {
// //   _id: Types.ObjectId;
// //   name: string;
// //   description: string;
// //   status: 'public' | 'private';
// //   creator: Types.ObjectId;
// //   members: {
// //     _id: Types.ObjectId;
// //     username: string;
// //     email: string;
// //   }[];
// //   messages: Types.ObjectId[] | MessagePopulated[];
// // }

// // @Schema({ timestamps: true })
// // export class GroupSchemaDefinition {
// //   @Prop({ required: true })
// //   name: string;

// //   @Prop({ required: true })
// //   description: string;

// //   @Prop({ default: 'public' })
// //   status: 'public' | 'private';

// //   @Prop({ type: Types.ObjectId, ref: 'User', required: true })
// //   creator: Types.ObjectId;

// //   @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
// //   members: Types.ObjectId[];

// //   @Prop({ type: [{ type: Types.ObjectId, ref: 'Message' }], default: [] })
// //   messages: Types.ObjectId[];
// // }

// // export const GroupSchema = SchemaFactory.createForClass(GroupSchemaDefinition);

// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document, Types } from 'mongoose';

// // Message interface for populated data
// export interface MessagePopulated {
//   _id: Types.ObjectId;
//   content: string;
//   type: 'text' | 'image' | 'document' | 'audio' | 'video';
//   sender: {
//     _id: Types.ObjectId;
//     username: string;
//     email: string;
//   };
//   attachments: string[];
//   readBy: { user: Types.ObjectId; readAt: Date }[];
//   createdAt: Date;
//   updatedAt: Date;
// }

// // GroupDocument interface
// export interface GroupDocument extends Document {
//   _id: Types.ObjectId;
//   name: string;
//   description: string;
//   status: 'public' | 'private';
//   creator: Types.ObjectId;
//   members: {
//     _id: Types.ObjectId;
//     username: string;
//     email: string;
//   }[];
//   messages: Types.ObjectId[] | MessagePopulated[];
// }

// @Schema({ timestamps: true })
// export class Group {
//   @Prop({ required: true })
//   name: string;

//   @Prop({ required: true })
//   description: string;

//   @Prop({ default: 'public' })
//   status: 'public' | 'private';

//   @Prop({ type: Types.ObjectId, ref: 'User', required: true })
//   creator: Types.ObjectId;

//   @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
//   members: Types.ObjectId[];

//   @Prop({ type: [{ type: Types.ObjectId, ref: 'Message' }], default: [] })
//   messages: Types.ObjectId[];
// }

// export const GroupSchema = SchemaFactory.createForClass(Group);

// group.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GroupDocument = Group & Document;

@Schema({ timestamps: true })
export class Group {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  creator: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  members: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Message' }] })
  messages: Types.ObjectId[];

  @Prop({ type: String, enum: ['public', 'private'], default: 'public' })
  status: 'public' | 'private';
}

export const GroupSchema = SchemaFactory.createForClass(Group);
