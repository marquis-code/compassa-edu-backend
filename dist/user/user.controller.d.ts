import { UserDocument } from "./user.schema";
import { Request } from "express";
import { UserService } from "./user.service";
import { MaterialService } from "../materials/materials.service";
import { Material } from "../materials/materials.schema";
import { MaterialStatus } from '../materials/dto/create-materials.dto';
import { CreateUserDto, UpdateUserDto } from "./user.dto";
import { CreateMaterialDto } from "../materials/dto/create-materials.dto";
export declare class UserController {
    private userService;
    private readonly materialService;
    constructor(userService: UserService, materialService: MaterialService);
    getAllMaterials(query: any): Promise<Material[]>;
    getUserMaterials(req: Request): Promise<Material[]>;
    getUserProfile(req: Request): Promise<any>;
    getPendingMaterials(query: any): Promise<Material[]>;
    getApprovedMaterials(query: any): Promise<Material[]>;
    getUsers(): Promise<{
        users: (import("mongoose").Document<unknown, {}, UserDocument> & import("mongoose").Document<unknown, {}, import("./user.schema").User> & import("./user.schema").User & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            matchPassword: (password: string) => Promise<boolean>;
            getSignedJwtToken: () => string;
            getResetPasswordToken: () => string;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
    }>;
    createUser(dto: CreateUserDto): Promise<{
        user: import("./user.schema").User;
    }>;
    getUser(id: string): Promise<import("mongoose").Document<unknown, {}, UserDocument> & import("mongoose").Document<unknown, {}, import("./user.schema").User> & import("./user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        matchPassword: (password: string) => Promise<boolean>;
        getSignedJwtToken: () => string;
        getResetPasswordToken: () => string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    uploadMaterial(createMaterialDto: CreateMaterialDto, req: Request): Promise<Material>;
    updateUser(id: string, dto: UpdateUserDto, user: UserDocument): Promise<{
        user: import("mongoose").Document<unknown, {}, UserDocument> & import("mongoose").Document<unknown, {}, import("./user.schema").User> & import("./user.schema").User & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            matchPassword: (password: string) => Promise<boolean>;
            getSignedJwtToken: () => string;
            getResetPasswordToken: () => string;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>;
    }>;
    deleteUser(id: string, user: UserDocument): Promise<{}>;
    batchApproveMaterials(materials: {
        materialId: string;
        userId: string;
    }[]): Promise<{
        message: string;
        results: {
            materialId: string;
            status: string;
            error?: string;
        }[];
    }>;
    updateMaterialStatus(materialId: string, userId: string, status: MaterialStatus, comment?: string): Promise<{
        message: string;
        material: Material;
    }>;
}
