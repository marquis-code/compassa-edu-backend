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
import { Model } from "mongoose";
import { User, UserDocument } from "./user.schema";
import { CreateUserDto, UpdateUserDto } from "./user.dto";
import { Material } from "../materials/materials.schema";
import { MaterialService } from "../materials/materials.service";
export declare class UserService {
    private readonly User;
    private readonly materialService;
    constructor(User: Model<UserDocument>, materialService: MaterialService);
    getUsers(): Promise<{
        users: (import("mongoose").Document<unknown, {}, UserDocument> & import("mongoose").Document<unknown, {}, User> & User & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            matchPassword: (password: string) => Promise<boolean>;
            getSignedJwtToken: () => string;
            getResetPasswordToken: () => string;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
    }>;
    createUser(createUserDto: CreateUserDto): Promise<{
        user: User;
    }>;
    getUser(id: string): Promise<import("mongoose").Document<unknown, {}, UserDocument> & import("mongoose").Document<unknown, {}, User> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        matchPassword: (password: string) => Promise<boolean>;
        getSignedJwtToken: () => string;
        getResetPasswordToken: () => string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    updateUser(id: string, dto: UpdateUserDto, currentUser: UserDocument): Promise<{
        user: import("mongoose").Document<unknown, {}, UserDocument> & import("mongoose").Document<unknown, {}, User> & User & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            matchPassword: (password: string) => Promise<boolean>;
            getSignedJwtToken: () => string;
            getResetPasswordToken: () => string;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>;
    }>;
    deleteUser(id: string, currentUser: UserDocument): Promise<{}>;
    uploadMaterial(userId: string, name: string, description: string, fileUrl: string, academicLevel: string, semester: string, materialType: string): Promise<Material>;
    getApprovedMaterials(query: any): Promise<Material[]>;
    addPointsToUser(userId: string, points: number): Promise<void>;
    addUploadedMaterial(userId: string, materialId: string): Promise<void>;
    getUserMaterials(userId: string): Promise<Material[]>;
    getUserProfile(userId: string): Promise<any>;
}
