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
exports.UserController = void 0;
const common_1 = require("@nestjs/common/");
const class_validator_1 = require("class-validator");
const auth_decorator_1 = require("../auth/auth.decorator");
const user_decorator_1 = require("./user.decorator");
const user_service_1 = require("./user.service");
const materials_service_1 = require("../materials/materials.service");
const create_materials_dto_1 = require("../materials/dto/create-materials.dto");
const user_dto_1 = require("./user.dto");
const create_materials_dto_2 = require("../materials/dto/create-materials.dto");
const validate_mongoId_1 = require("../utils/validate-mongoId");
let UserController = class UserController {
    constructor(userService, materialService) {
        this.userService = userService;
        this.materialService = materialService;
    }
    async getAllMaterials(query) {
        return this.materialService.getAllMaterials(query);
    }
    async getUserMaterials(req) {
        console.log(req.user, 'uer Obj');
        if (!req.user || !req.user._id) {
            throw new common_1.HttpException("User not authenticated", common_1.HttpStatus.UNAUTHORIZED);
        }
        const userId = req.user._id;
        const userIdString = typeof userId === 'string' ? userId : userId.toString();
        if (!(0, class_validator_1.isMongoId)(userIdString)) {
            throw new common_1.HttpException("Invalid user ID", common_1.HttpStatus.BAD_REQUEST);
        }
        return this.userService.getUserMaterials(userIdString);
    }
    async getUserProfile(req) {
        var _a;
        console.log("User object:", req.user);
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            throw new common_1.HttpException("User not authenticated", common_1.HttpStatus.UNAUTHORIZED);
        }
        const userIdString = userId.toString();
        if (!(0, class_validator_1.isMongoId)(userIdString)) {
            throw new common_1.HttpException("Invalid user ID", common_1.HttpStatus.BAD_REQUEST);
        }
        return this.userService.getUserProfile(userIdString);
    }
    async getPendingMaterials(query) {
        return this.materialService.getPendingMaterials(query);
    }
    async getApprovedMaterials(query) {
        return this.userService.getApprovedMaterials(query);
    }
    getUsers() {
        return this.userService.getUsers();
    }
    createUser(dto) {
        return this.userService.createUser(dto);
    }
    getUser(id) {
        return this.userService.getUser(id);
    }
    async uploadMaterial(createMaterialDto, req) {
        var _a;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            throw new Error("User is not authenticated");
        }
        const { name, description, fileUrl, academicLevel, semester, materialType, } = createMaterialDto;
        const material = await this.materialService.create({ name, description, fileUrl, academicLevel, semester, materialType }, userId);
        return material;
    }
    updateUser(id, dto, user) {
        return this.userService.updateUser(id, dto, user);
    }
    deleteUser(id, user) {
        return this.userService.deleteUser(id, user);
    }
    async batchApproveMaterials(materials) {
        if (!materials || materials.length === 0) {
            throw new common_1.BadRequestException("No materials provided for batch approval");
        }
        const results = [];
        const userPointsMap = {};
        for (const { materialId, userId } of materials) {
            try {
                const material = await this.materialService.findById(materialId);
                if (!material) {
                    results.push({
                        materialId,
                        status: "failed",
                        error: `Material with ID ${materialId} not found`,
                    });
                    continue;
                }
                if (material.status === "approved") {
                    results.push({
                        materialId,
                        status: "failed",
                        error: `Material with ID ${materialId} is already approved`,
                    });
                    continue;
                }
                const approvedMaterial = await this.materialService.approveMaterialById(materialId);
                if (!userPointsMap[userId]) {
                    userPointsMap[userId] = 0;
                }
                userPointsMap[userId] += 10;
                results.push({
                    materialId,
                    status: "success",
                });
            }
            catch (error) {
                results.push({
                    materialId,
                    status: "failed",
                    error: error.message,
                });
            }
        }
        for (const [userId, points] of Object.entries(userPointsMap)) {
            try {
                await this.userService.addPointsToUser(userId, points);
            }
            catch (error) {
                console.error(`Failed to allocate points to user ${userId}:`, error.message);
            }
        }
        return {
            message: "Batch approval process completed",
            results,
        };
    }
    async updateMaterialStatus(materialId, userId, status, comment) {
        console.log(materialId, 'material id from controller');
        const material = await this.materialService.findMaterialById(materialId);
        if (material.status === status) {
            return {
                message: `Material already has the status '${status}'`,
                material,
            };
        }
        const updatePayload = { status };
        if (status === create_materials_dto_1.MaterialStatus.REJECTED) {
            if (!comment || comment.trim() === '') {
                throw new common_1.BadRequestException('A comment is required when rejecting a material');
            }
            updatePayload['comment'] = comment;
        }
        const updatedMaterial = await this.materialService.updateMaterialById(materialId, updatePayload);
        if (status === create_materials_dto_1.MaterialStatus.APPROVED) {
            await this.userService.addPointsToUser(userId, 10);
        }
        return {
            message: `Material status has been updated to '${status}' successfully`,
            material: updatedMaterial,
        };
    }
};
exports.UserController = UserController;
__decorate([
    (0, auth_decorator_1.Auth)(),
    (0, common_1.Get)("all-materials"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllMaterials", null);
__decorate([
    (0, auth_decorator_1.Auth)(),
    (0, common_1.Get)("my-materials"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserMaterials", null);
__decorate([
    (0, auth_decorator_1.Auth)(),
    (0, common_1.Get)("profile"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserProfile", null);
__decorate([
    (0, auth_decorator_1.Auth)(),
    (0, common_1.Get)("pending-materials"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getPendingMaterials", null);
__decorate([
    (0, auth_decorator_1.Auth)(),
    (0, common_1.Get)("approved-materials"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getApprovedMaterials", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.CreateUserDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "createUser", null);
__decorate([
    (0, common_1.Get)("/:id"),
    __param(0, (0, common_1.Param)("id", validate_mongoId_1.ValidateMongoId)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getUser", null);
__decorate([
    (0, auth_decorator_1.Auth)(),
    (0, common_1.Post)("upload-material"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_materials_dto_2.CreateMaterialDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "uploadMaterial", null);
__decorate([
    (0, auth_decorator_1.Auth)(),
    (0, common_1.Put)("/:id"),
    __param(0, (0, common_1.Param)("id", validate_mongoId_1.ValidateMongoId)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_dto_1.UpdateUserDto, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)("/:id"),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)("id", validate_mongoId_1.ValidateMongoId)),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "deleteUser", null);
__decorate([
    (0, auth_decorator_1.Auth)(),
    (0, common_1.Post)("/batch-approve"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "batchApproveMaterials", null);
__decorate([
    (0, auth_decorator_1.Auth)(),
    (0, common_1.Post)("/update-material-status"),
    __param(0, (0, common_1.Query)("materialId")),
    __param(1, (0, common_1.Query)("userId")),
    __param(2, (0, common_1.Query)("status")),
    __param(3, (0, common_1.Query)("comment")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateMaterialStatus", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)("users"),
    __metadata("design:paramtypes", [user_service_1.UserService,
        materials_service_1.MaterialService])
], UserController);
//# sourceMappingURL=user.controller.js.map