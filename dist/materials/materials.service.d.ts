import { Model } from 'mongoose';
import { UpdateMaterialDto } from './dto/update-materials.dto';
import { UserService } from '../user/user.service';
import { Material, MaterialDocument, Category, CategoryDocument, Session, SessionDocument } from './materials.schema';
import { CreateMaterialDto, CreateCategoryDto, CreateSessionDto, MaterialStatus } from './dto/create-materials.dto';
export declare class MaterialService {
    private materialModel;
    private categoryModel;
    private sessionModel;
    private readonly userService;
    constructor(materialModel: Model<MaterialDocument>, categoryModel: Model<CategoryDocument>, sessionModel: Model<SessionDocument>, userService: UserService);
    create(createMaterialDto: CreateMaterialDto, userId: string): Promise<Material>;
    batchCreateMaterials(createMaterialsDto: CreateMaterialDto[], userId: string): Promise<Material[]>;
    createCategory(createCategoryDto: CreateCategoryDto): Promise<Category>;
    getCategories(): Promise<Category[]>;
    updateCategory(id: string, updateCategoryDto: CreateCategoryDto): Promise<Category>;
    deleteCategory(id: string): Promise<void>;
    createSession(createSessionDto: CreateSessionDto): Promise<Session>;
    getSessions(): Promise<Session[]>;
    updateSession(id: string, updateSessionDto: CreateSessionDto): Promise<Session>;
    deleteSession(id: string): Promise<void>;
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
    findByCategoryId(categoryId: string): Promise<(import("mongoose").Document<unknown, {}, MaterialDocument> & Material & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findBySessionId(sessionId: string): Promise<(import("mongoose").Document<unknown, {}, MaterialDocument> & Material & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
}
