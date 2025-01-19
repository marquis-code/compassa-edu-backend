/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferrawdoctype" />
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
    content: string;
    attachments: string[];
    type: 'text' | 'image' | 'document' | 'video' | 'audio';
    readBy: ReadByPopulated[];
    createdAt: Date;
    updatedAt: Date;
}
export declare class Message extends Document {
    sender: Types.ObjectId;
    group: Types.ObjectId;
    content: string;
    attachments: string[];
    type: 'text' | 'image' | 'document' | 'video' | 'audio';
    readBy: ReadBy[];
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
