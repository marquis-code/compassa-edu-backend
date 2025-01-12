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
import { Model } from 'mongoose';
import { Material, MaterialDocument } from './materials.schema';
import { CreateMaterialDto, MaterialStatus } from './dto/create-materials.dto';
import { UpdateMaterialDto } from './dto/update-materials.dto';
import { UserService } from '../user/user.service';
export declare class MaterialService {
    private materialModel;
    private readonly userService;
    constructor(materialModel: Model<MaterialDocument>, userService: UserService);
    create(createMaterialDto: CreateMaterialDto, userId: string): Promise<Material>;
    findAll(query: any): Promise<Material[]>;
    findOne(id: string, userId: string): Promise<Material>;
    update(id: string, updateMaterialDto: UpdateMaterialDto, userId: string): Promise<Material>;
    delete(id: string, userId: string): Promise<void>;
    findByUserId(userId: string): Promise<Material[]>;
    approveMaterial(materialId: string, userId: string, status: string): Promise<{
        message: string;
        material: Material;
    }>;
    getPendingMaterials(query: any): Promise<Material[]>;
    getAllMaterials(query: any): Promise<Material[]>;
    countMaterialsByUser(userId: string): Promise<number>;
    findById(materialId: string): Promise<Material>;
    approveMaterialById(materialId: string): Promise<Material>;
    findMaterialById(materialId: string): Promise<Material>;
    updateMaterialById(materialId: string, updatePayload: Partial<Material>): Promise<Material>;
    batchUpdateStatus(updates: {
        materialId: string;
        userId: string;
        status: MaterialStatus;
        comment?: string;
    }[]): Promise<{
        success: number;
        failed: number;
        details: any[];
    }>;
}
