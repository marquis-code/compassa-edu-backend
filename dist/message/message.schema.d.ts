import { Document, Types } from 'mongoose';
export interface ReadBy {
    user: Types.ObjectId;
    readAt: Date;
}
export interface ReadByPopulated {
    user: {
        _id: Types.ObjectId;
        username: string;
        email: string;
    };
    readAt: Date;
}
export interface MessagePopulated extends Document {
    sender: {
        _id: Types.ObjectId;
        username: string;
        email: string;
    };
    group: Types.ObjectId;
    content?: string;
    attachments: string[];
    type: 'text' | 'image' | 'document' | 'video' | 'audio';
    readBy: ReadByPopulated[];
    createdAt: Date;
    updatedAt: Date;
}
export declare class Message extends Document {
    sender: Types.ObjectId;
    group: Types.ObjectId;
    content?: string;
    attachments: string[];
    type: 'text' | 'image' | 'document' | 'video' | 'audio';
    readBy: ReadBy[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const MessageSchema: import("mongoose").Schema<Message, import("mongoose").Model<Message, any, any, any, Document<unknown, any, Message> & Message & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Message, Document<unknown, {}, import("mongoose").FlatRecord<Message>> & import("mongoose").FlatRecord<Message> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
