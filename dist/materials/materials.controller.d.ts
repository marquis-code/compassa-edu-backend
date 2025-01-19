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
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferrawdoctype" />
import { MaterialService } from '../materials/materials.service';
import { CreateMaterialDto, MaterialStatus } from './dto/create-materials.dto';
import { UpdateMaterialDto } from './dto/update-materials.dto';
import { CreateSessionDto } from './dto/create-session-dto';
import { CreateCategoryDto } from './dto/create-category-dto';
export declare class MaterialsController {
    private readonly materialService;
    constructor(materialService: MaterialService);
    uploadMaterial(createMaterialDto: CreateMaterialDto, req: any): Promise<{
        success: boolean;
        data: import("./materials.schema").Material;
    }>;
    createCategory(createCategoryDto: CreateCategoryDto): Promise<{
        success: boolean;
        data: import("./materials.schema").Category;
    }>;
    getCategories(): Promise<{
        success: boolean;
        data: import("./materials.schema").Category[];
    }>;
    updateCategory(id: string, updateCategoryDto: CreateCategoryDto): Promise<{
        success: boolean;
        data: import("./materials.schema").Category;
    }>;
    deleteCategory(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    createSession(createSessionDto: CreateSessionDto): Promise<{
        success: boolean;
        data: import("./materials.schema").Session;
    }>;
    getSessions(): Promise<{
        success: boolean;
        data: import("./materials.schema").Session[];
    }>;
    updateSession(id: string, updateSessionDto: CreateSessionDto): Promise<{
        success: boolean;
        data: import("./materials.schema").Session;
    }>;
    deleteSession(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    batchUploadMaterials(body: {
        materials: CreateMaterialDto[];
    }, req: any): Promise<{
        success: boolean;
        data: import("./materials.schema").Material[];
    }>;
    findAll(req: any): Promise<{
        success: boolean;
        data: import("./materials.schema").Material[];
    }>;
    findAllUserActivities(userId: string, req: any): Promise<{
        success: boolean;
        data: import("./materials.schema").Material[];
    }>;
    findOne(id: string, req: any): Promise<{
        success: boolean;
        data: import("./materials.schema").Material;
    }>;
    update(id: string, UpdateMaterialDto: UpdateMaterialDto, req: any): Promise<{
        success: boolean;
        data: import("./materials.schema").Material;
    }>;
    delete(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getMaterialsByCategory(categoryId: string): Promise<{
        success: boolean;
        data: (import("mongoose").Document<unknown, {}, import("./materials.schema").MaterialDocument> & import("./materials.schema").Material & import("mongoose").Document<unknown, any, any> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
    }>;
    getMaterialsBySession(sessionId: string): Promise<{
        success: boolean;
        data: (import("mongoose").Document<unknown, {}, import("./materials.schema").MaterialDocument> & import("./materials.schema").Material & import("mongoose").Document<unknown, any, any> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
    }>;
    batchUpdateMaterialStatus(updates: {
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
