import { Document, Types } from 'mongoose';
export type GroupDocument = Group & Document;
export declare class Group {
    name: string;
    description: string;
    creator: Types.ObjectId;
    members: Types.ObjectId[];
    messages: Types.ObjectId[];
    status: 'public' | 'private';
}
export declare const GroupSchema: import("mongoose").Schema<Group, import("mongoose").Model<Group, any, any, any, Document<unknown, any, Group> & Group & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Group, Document<unknown, {}, import("mongoose").FlatRecord<Group>> & import("mongoose").FlatRecord<Group> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
