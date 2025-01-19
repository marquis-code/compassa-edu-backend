"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialsController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../auth/auth.guard");
const materials_service_1 = require("../materials/materials.service");
const create_materials_dto_1 = require("./dto/create-materials.dto");
const update_materials_dto_1 = require("./dto/update-materials.dto");
const create_session_dto_1 = require("./dto/create-session-dto");
const create_category_dto_1 = require("./dto/create-category-dto");
let MaterialsController = class MaterialsController {
    constructor(materialService) {
        this.materialService = materialService;
    }
    async uploadMaterial(createMaterialDto, req) {
        var _a;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            throw new Error('User is not authenticated');
        }
        const material = await this.materialService.create(createMaterialDto, userId);
        return { success: true, data: material };
    }
    async createCategory(createCategoryDto) {
        const category = await this.materialService.createCategory(createCategoryDto);
        return { success: true, data: category };
    }
    async getCategories() {
        const categories = await this.materialService.getCategories();
        return { success: true, data: categories };
    }
    async updateCategory(id, updateCategoryDto) {
        const category = await this.materialService.updateCategory(id, updateCategoryDto);
        return { success: true, data: category };
    }
    async deleteCategory(id) {
        await this.materialService.deleteCategory(id);
        return { success: true, message: 'Category deleted successfully' };
    }
    async createSession(createSessionDto) {
        const session = await this.materialService.createSession(createSessionDto);
        return { success: true, data: session };
    }
    async getSessions() {
        const sessions = await this.materialService.getSessions();
        return { success: true, data: sessions };
    }
    async updateSession(id, updateSessionDto) {
        const session = await this.materialService.updateSession(id, updateSessionDto);
        return { success: true, data: session };
    }
    async deleteSession(id) {
        await this.materialService.deleteSession(id);
        return { success: true, message: 'Session deleted successfully' };
    }
    async batchUploadMaterials(body, req) {
        var _a;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            throw new Error('User is not authenticated');
        }
        const materialsDtoArray = Array.isArray(body.materials) ? body.materials : [];
        const materials = await this.materialService.batchCreateMaterials(materialsDtoArray, userId);
        return { success: true, data: materials };
    }
    async findAll(req) {
        try {
            const activities = await this.materialService.findAll(req.user.id);
            return { success: true, data: activities };
        }
        catch (error) {
            throw new common_1.HttpException('Error fetching activities', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findAllUserActivities(userId, req) {
        try {
            if (!userId) {
                throw new common_1.HttpException('User ID is required to fetch activities', common_1.HttpStatus.BAD_REQUEST);
            }
            const activities = await this.materialService.findByUserId(userId);
            return { success: true, data: activities };
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Error fetching activities', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id, req) {
        try {
            console.log(id, req.user.id, 'ids here');
            const material = await this.materialService.findOne(id, req.user.id);
            return { success: true, data: material };
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Error fetching material', common_1.HttpStatus.NOT_FOUND);
        }
    }
    async update(id, UpdateMaterialDto, req) {
        try {
            const updatedMaterial = await this.materialService.update(id, UpdateMaterialDto, req.user.id);
            return { success: true, data: updatedMaterial };
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Error updating material', common_1.HttpStatus.NOT_FOUND);
        }
    }
    async delete(id, req) {
        try {
            await this.materialService.delete(id, req.user.id);
            return { success: true, message: 'Material deleted successfully' };
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Error deleting material', common_1.HttpStatus.NOT_FOUND);
        }
    }
    async getMaterialsByCategory(categoryId) {
        try {
            const materials = await this.materialService.findByCategoryId(categoryId);
            return { success: true, data: materials };
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Error fetching materials by category', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getMaterialsBySession(sessionId) {
        try {
            const materials = await this.materialService.findBySessionId(sessionId);
            return { success: true, data: materials };
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Error fetching materials by session', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async batchUpdateMaterialStatus(updates) {
        return await this.materialService.batchUpdateStatus(updates);
    }
};
exports.MaterialsController = MaterialsController;
__decorate([
    (0, common_1.Post)('upload-material'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_materials_dto_1.CreateMaterialDto, Object]),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "uploadMaterial", null);
__decorate([
    (0, common_1.Post)('category'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Put)('category/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Delete)('category/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "deleteCategory", null);
__decorate([
    (0, common_1.Post)('session'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_session_dto_1.CreateSessionDto]),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "createSession", null);
__decorate([
    (0, common_1.Get)('sessions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "getSessions", null);
__decorate([
    (0, common_1.Put)('session/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_session_dto_1.CreateSessionDto]),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "updateSession", null);
__decorate([
    (0, common_1.Delete)('session/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "deleteSession", null);
__decorate([
    (0, common_1.Post)('batch-upload-materials'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "batchUploadMaterials", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "findAllUserActivities", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_materials_dto_1.UpdateMaterialDto, Object]),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)('by-category/:categoryId'),
    __param(0, (0, common_1.Param)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "getMaterialsByCategory", null);
__decorate([
    (0, common_1.Get)('by-session/:sessionId'),
    __param(0, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "getMaterialsBySession", null);
__decorate([
    (0, common_1.Patch)('batch-update-status'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "batchUpdateMaterialStatus", null);
exports.MaterialsController = MaterialsController = __decorate([
    (0, common_1.Controller)('materials'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [materials_service_1.MaterialService])
], MaterialsController);
//# sourceMappingURL=materials.controller.js.map