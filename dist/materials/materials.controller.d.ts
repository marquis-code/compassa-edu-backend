import { Document } from 'mongoose';
import { MaterialService } from '../materials/materials.service';
import { CreateMaterialDto, MaterialStatus } from './dto/create-materials.dto';
import { MaterialDocument } from '../materials/materials.schema';
import { UpdateMaterialDto } from './dto/update-materials.dto';
import { CreateSessionDto } from './dto/create-session-dto';
import { CreateCategoryDto } from './dto/create-category-dto';
import { AuditService } from '../audit/audit.service';
export declare class MaterialsController {
    private readonly materialService;
    private readonly auditService;
    constructor(materialService: MaterialService, auditService: AuditService);
    uploadMaterial(createMaterialDto: CreateMaterialDto, req: any): Promise<{
        success: boolean;
        data: import("../materials/materials.schema").Material;
    }>;
    createCategory(createCategoryDto: CreateCategoryDto, req: any): Promise<{
        success: boolean;
        data: import("../materials/materials.schema").Category;
    }>;
    getCategories(req: any): Promise<{
        success: boolean;
        data: import("../materials/materials.schema").Category[];
    }>;
    updateCategory(id: string, updateCategoryDto: CreateCategoryDto, req: any): Promise<{
        success: boolean;
        data: import("../materials/materials.schema").Category;
    }>;
    deleteCategory(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    createSession(createSessionDto: CreateSessionDto, req: any): Promise<{
        success: boolean;
        data: import("../materials/materials.schema").Session;
    }>;
    getSessions(req: any): Promise<{
        success: boolean;
        data: import("../materials/materials.schema").Session[];
    }>;
    updateSession(id: string, updateSessionDto: CreateSessionDto, req: any): Promise<{
        success: boolean;
        data: import("../materials/materials.schema").Session;
    }>;
    deleteSession(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    batchUploadMaterials(body: {
        materials: CreateMaterialDto[];
    }, req: any): Promise<{
        success: boolean;
        data: import("../materials/materials.schema").Material[];
    }>;
    findAll(req: any): Promise<{
        success: boolean;
        data: import("../materials/materials.schema").Material[];
    }>;
    findAllUserActivities(userId: string, req: any): Promise<{
        success: boolean;
        data: import("../materials/materials.schema").Material[];
    }>;
    findOne(id: string, req: any): Promise<{
        success: boolean;
        data: import("../materials/materials.schema").Material;
    }>;
    update(id: string, updateMaterialDto: UpdateMaterialDto, req: any): Promise<{
        success: boolean;
        data: import("../materials/materials.schema").Material;
    }>;
    delete(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getMaterialsByCategory(categoryId: string, req: any): Promise<{
        success: boolean;
        data: (Document<unknown, {}, MaterialDocument> & import("../materials/materials.schema").Material & Document<unknown, any, any> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
    }>;
    getMaterialsBySession(sessionId: string, req: any): Promise<{
        success: boolean;
        data: (Document<unknown, {}, MaterialDocument> & import("../materials/materials.schema").Material & Document<unknown, any, any> & Required<{
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
    }[], req: any): Promise<{
        success: number;
        failed: number;
        details: any[];
    }>;
}
