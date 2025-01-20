import { Types } from "mongoose";
import { HydratedDocument } from "mongoose";
export type UserDocument = HydratedDocument<User> & {
    matchPassword: (password: string) => Promise<boolean>;
    getSignedJwtToken: () => string;
    getResetPasswordToken: () => string;
};
export declare enum UserRole {
    ADMIN = "admin",
    USER = "user"
}
export declare class User {
    name: string;
    email: string;
    password: string;
    phone: string;
    matric: string;
    points?: number;
    resetPasswordToken?: string;
    resetPasswordExpire?: Date;
    uploadedMaterials?: Types.ObjectId[];
    groups: Types.ObjectId[];
    role: UserRole;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, import("mongoose").Document<unknown, any, User> & User & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<User>> & import("mongoose").FlatRecord<User> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
