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
import { MaterialStatus, Semester, MaterialType, AcademicLevel } from '../materials/dto/create-materials.dto';
export type MaterialDocument = Material & Document;
export type CategoryDocument = Category & Document;
export type SessionDocument = Session & Document;
export declare class Category {
    name: string;
    description?: string;
}
export declare const CategorySchema: import("mongoose").Schema<Category, import("mongoose").Model<Category, any, any, any, Document<unknown, any, Category> & Category & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Category, Document<unknown, {}, import("mongoose").FlatRecord<Category>> & import("mongoose").FlatRecord<Category> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare class Session {
    name: string;
    description?: string;
}
export declare const SessionSchema: import("mongoose").Schema<Session, import("mongoose").Model<Session, any, any, any, Document<unknown, any, Session> & Session & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Session, Document<unknown, {}, import("mongoose").FlatRecord<Session>> & import("mongoose").FlatRecord<Session> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare class Material {
    name: string;
    description: string;
    comment?: string;
    fileUrls: string[];
    status: MaterialStatus;
    user: Types.ObjectId;
    academicLevel: AcademicLevel;
    semester: Semester;
    materialType: MaterialType;
    category: Types.ObjectId;
    session: Types.ObjectId;
}
export declare const MaterialSchema: import("mongoose").Schema<Material, import("mongoose").Model<Material, any, any, any, Document<unknown, any, Material> & Material & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Material, Document<unknown, {}, import("mongoose").FlatRecord<Material>> & import("mongoose").FlatRecord<Material> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
