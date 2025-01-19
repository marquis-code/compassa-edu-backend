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
