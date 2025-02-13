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
    lecturer?: string;
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
