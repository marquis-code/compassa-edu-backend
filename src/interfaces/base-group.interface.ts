import { Types } from 'mongoose';

export interface BaseGroup {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  creator: Types.ObjectId;
  status: 'public' | 'private';
  createdAt: Date;
  updatedAt: Date;
}
