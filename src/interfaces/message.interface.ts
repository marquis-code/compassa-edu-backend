import { Types } from 'mongoose';
import { User } from './user.interface';

export interface Message {
  _id: Types.ObjectId;
  content: string;
  type: string;
  sender: User;
  attachments: string[];
  readBy: { user: User; readAt: Date }[];
  createdAt: Date;
  updatedAt: Date;
}