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
const auth_decorator_1 = require("../auth/auth.decorator");
const user_decorator_1 = require("./user.decorator");
const user_service_1 = require("./user.service");
const materials_service_1 = require("../materials/materials.service");
const user_dto_1 = require("./user.dto");
const validate_mongoId_1 = require("../utils/validate-mongoId");
let UserController = class UserController {
    constructor(userService, materialService) {
        this.userService = userService;
        this.materialService = materialService;
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
    updateUser(id, dto, user) {
        return this.userService.updateUser(id, dto, user);
    }
    deleteUser(id, user) {
        return this.userService.deleteUser(id, user);
    }
    async approveMaterial(materialId, userId) {
        const material = await this.materialService.approveMaterial(materialId, userId);
        return material;
    }
    async getPendingMaterials(query) {
        return this.materialService.getPendingMaterials(query);
    }
    async getAllMaterials(query) {
        return this.materialService.getAllMaterials(query);
    }
    async getApprovedMaterials(query) {
        return this.userService.getApprovedMaterials(query);
    }
    async getUserMaterials(req) {
        var _a;
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId)) {
            throw new common_1.HttpException('User not authenticated', common_1.HttpStatus.UNAUTHORIZED);
        }
        return this.userService.getUserMaterials(req.user.userId);
    }
    async getUserProfile(req) {
        var _a;
        return this.userService.getUserProfile((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
    }
};
exports.UserController = UserController;
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
    (0, common_1.Put)("/:id"),
    (0, auth_decorator_1.Auth)(),
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
    (0, common_1.Post)('/approve/:materialId/:userId'),
    __param(0, (0, common_1.Param)('materialId')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "approveMaterial", null);
__decorate([
    (0, auth_decorator_1.Auth)(),
    (0, common_1.Get)('pending-materials'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getPendingMaterials", null);
__decorate([
    (0, auth_decorator_1.Auth)(),
    (0, common_1.Get)('all-materials'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllMaterials", null);
__decorate([
    (0, auth_decorator_1.Auth)(),
    (0, common_1.Get)('approved-materials'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getApprovedMaterials", null);
__decorate([
    (0, auth_decorator_1.Auth)(),
    (0, common_1.Get)('my-materials'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserMaterials", null);
__decorate([
    (0, auth_decorator_1.Auth)(),
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserProfile", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)("users"),
    __metadata("design:paramtypes", [user_service_1.UserService,
        materials_service_1.MaterialService])
], UserController);
//# sourceMappingURL=user.controller.js.map