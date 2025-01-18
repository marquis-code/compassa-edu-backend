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
exports.MaterialService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const materials_schema_1 = require("./materials.schema");
const create_materials_dto_1 = require("./dto/create-materials.dto");
const user_service_1 = require("../user/user.service");
let MaterialService = class MaterialService {
    constructor(materialModel, userService) {
        this.materialModel = materialModel;
        this.userService = userService;
    }
    async create(createMaterialDto, userId) {
        const createdMaterial = new this.materialModel(Object.assign(Object.assign({}, createMaterialDto), { user: userId }));
        const savedMaterial = await createdMaterial.save();
        await this.userService.addUploadedMaterial(userId, savedMaterial._id);
        return savedMaterial;
    }
    async findAll(query) {
        const filters = { status: 'approved' };
        if (query.academicLevel) {
            filters.academicLevel = query.academicLevel;
        }
        if (query.semester) {
            filters.semester = query.semester;
        }
        if (query.materialType) {
            filters.materialType = query.materialType;
        }
        return this.materialModel.find(filters).exec();
    }
    async findOne(id, userId) {
        const material = await this.materialModel
            .findOne({ _id: id, user: userId })
            .exec();
        if (!material) {
            throw new common_1.NotFoundException(`Material with ID ${id} not found`);
        }
        return material;
    }
    async update(id, updateMaterialDto, userId) {
        const updatedMaterial = await this.materialModel
            .findOneAndUpdate({ _id: id, user: userId }, updateMaterialDto, {
            new: true,
        })
            .exec();
        if (!updatedMaterial) {
            throw new common_1.NotFoundException(`Material with ID ${id} not found`);
        }
        return updatedMaterial;
    }
    async delete(id, userId) {
        const result = await this.materialModel
            .findOneAndDelete({ _id: id, user: userId })
            .exec();
        if (!result) {
            throw new common_1.NotFoundException(`Material with ID ${id} not found`);
        }
    }
    async findByUserId(userId) {
        return this.materialModel.find({ user: userId }).exec();
    }
    async approveMaterial(materialId, userId, status) {
        const material = await this.materialModel.findById(materialId);
        if (!material) {
            throw new common_1.NotFoundException(`Material with ID ${materialId} not found`);
        }
        if (material.status === 'approved') {
            throw new common_1.ConflictException(`Material with ID ${materialId} has already been approved`);
        }
        const approvedMaterial = await this.materialModel.findByIdAndUpdate(materialId, { status: 'approved' }, { new: true });
        if (approvedMaterial) {
            await this.userService.addPointsToUser(userId, 10);
        }
        return {
            message: 'Material has been approved successfully',
            material: approvedMaterial,
        };
    }
    async getPendingMaterials(query) {
        const filters = { status: 'pending' };
        if (query.academicLevel) {
            filters.academicLevel = query.academicLevel;
        }
        if (query.semester) {
            filters.semester = query.semester;
        }
        if (query.materialType) {
            filters.materialType = query.materialType;
        }
        return this.materialModel.find(filters).exec();
    }
    async getAllMaterials(query) {
        const filters = {};
        if (query.academicLevel) {
            filters.academicLevel = query.academicLevel;
        }
        if (query.semester) {
            filters.semester = query.semester;
        }
        if (query.materialType) {
            filters.materialType = query.materialType;
        }
        if (query.status) {
            filters.status = query.status;
        }
        return this.materialModel.find(filters).exec();
    }
    async countMaterialsByUser(userId) {
        return this.materialModel.countDocuments({ user: userId });
    }
    async findById(materialId) {
        return this.materialModel.findById(materialId).exec();
    }
    async approveMaterialById(materialId) {
        return this.materialModel.findByIdAndUpdate(materialId, { status: 'approved' }, { new: true }).exec();
    }
    async findMaterialById(materialId) {
        console.log('Got it from here', materialId);
        const material = await this.materialModel.findById(materialId);
        if (!material) {
            throw new common_1.NotFoundException(`Material with ID ${materialId} not found`);
        }
        return material;
    }
    async updateMaterialById(materialId, updatePayload) {
        const updatedMaterial = await this.materialModel.findByIdAndUpdate(materialId, updatePayload, { new: true });
        if (!updatedMaterial) {
            throw new common_1.NotFoundException(`Material with ID ${materialId} not found for update`);
        }
        return updatedMaterial;
    }
    async batchUpdateStatus(updates) {
        const results = await Promise.all(updates.map(async (update) => {
            try {
                const { materialId, userId, status, comment } = update;
                if (!Object.values(create_materials_dto_1.MaterialStatus).includes(status)) {
                    throw new common_1.BadRequestException(`Invalid status: ${status}`);
                }
                const material = await this.findMaterialById(materialId);
                if (material.status === status) {
                    return {
                        materialId,
                        status,
                        message: `Material already has the status '${status}'`,
                        success: true,
                    };
                }
                const updatePayload = { status };
                if (status === create_materials_dto_1.MaterialStatus.REJECTED) {
                    if (!comment) {
                        throw new common_1.BadRequestException('A comment is required when rejecting a material');
                    }
                    updatePayload['comment'] = comment;
                }
                const updatedMaterial = await this.updateMaterialById(materialId, updatePayload);
                if (status === create_materials_dto_1.MaterialStatus.APPROVED) {
                    await this.userService.addPointsToUser(userId, 10);
                }
                return {
                    materialId,
                    status,
                    message: `Material status updated to '${status}' successfully`,
                    success: true,
                };
            }
            catch (error) {
                return {
                    materialId: update.materialId,
                    status: update.status,
                    message: error.message || 'Failed to update material status',
                    success: false,
                };
            }
        }));
        const success = results.filter((result) => result.success).length;
        const failed = results.filter((result) => !result.success).length;
        return {
            success,
            failed,
            details: results,
        };
    }
};
exports.MaterialService = MaterialService;
exports.MaterialService = MaterialService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(materials_schema_1.Material.name)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => user_service_1.UserService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        user_service_1.UserService])
], MaterialService);
//# sourceMappingURL=materials.service.js.map