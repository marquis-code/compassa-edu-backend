import { MaterialService } from '../materials/materials.service';
import { CreateMaterialDto, MaterialStatus } from './dto/create-materials.dto';
import { UpdateMaterialDto } from './dto/update-materials.dto';
export declare class MaterialsController {
    private readonly materialService;
    constructor(materialService: MaterialService);
    create(createMaterialDto: CreateMaterialDto, req: any): Promise<{
        success: boolean;
        data: import("./materials.schema").Material;
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
