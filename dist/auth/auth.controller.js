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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_dto_1 = require("./auth.dto");
const auth_decorator_1 = require("./auth.decorator");
const user_decorator_1 = require("../user/user.decorator");
const auth_sevice_1 = require("./auth.sevice");
const audit_service_1 = require("../audit/audit.service");
const audit_schema_1 = require("../audit/audit.schema");
const mongoose_1 = require("mongoose");
let AuthController = class AuthController {
    constructor(authService, auditService) {
        this.authService = authService;
        this.auditService = auditService;
    }
    async signup(dto, req) {
        var _a;
        const result = await this.authService.signup(dto);
        const user = (_a = result.user) !== null && _a !== void 0 ? _a : result;
        if (!user || !user._id) {
            throw new Error("User ID (_id) not found in signup response");
        }
        const userId = user._id.toString();
        await this.auditService.logAudit(audit_schema_1.AuditAction.CREATE, "User", userId, user, null, req.ip, req.headers["user-agent"], { email: dto.email });
        return user;
    }
    async login(dto, req) {
        const { token, user } = await this.authService.login(dto);
        const userId = user._id.toString();
        await this.auditService.logAudit(audit_schema_1.AuditAction.ACCESS, "User", userId, user, null, req.ip, req.headers["user-agent"], { matric: dto.matric });
        return { token, user };
    }
    getCurrentUser(user) {
        return { user };
    }
    async updatePassword(dto, user, req) {
        await this.authService.updatePassword(dto, user);
        await this.auditService.logAudit(audit_schema_1.AuditAction.UPDATE, "User", user.id, new mongoose_1.Types.ObjectId(user.id), { passwordChanged: true }, req.ip, req.headers["user-agent"]);
        return { message: "Password updated successfully" };
    }
    async forgotPassword(req, email) {
        await this.authService.forgotPassword(req, email);
        await this.auditService.logAudit(audit_schema_1.AuditAction.ACCESS, "User", null, null, { email }, req.ip, req.headers["user-agent"]);
        return { message: "Password reset link sent to your email" };
    }
    async resetPassword(dto, token, req) {
        const { user } = await this.authService.resetPassword(dto, token);
        const userId = user._id.toString();
        await this.auditService.logAudit(audit_schema_1.AuditAction.UPDATE, "User", userId, user._id, { passwordReset: true }, req.ip, req.headers["user-agent"]);
        return { message: "Password reset successfully" };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)("signup"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.SignupDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)("login"),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, auth_decorator_1.Auth)(),
    (0, common_1.Get)("profile"),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getCurrentUser", null);
__decorate([
    (0, auth_decorator_1.Auth)(),
    (0, common_1.Put)("update-password"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.UpdatePasswordDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updatePassword", null);
__decorate([
    (0, auth_decorator_1.Auth)(),
    (0, common_1.Post)("forgot-password"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)("email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Put)("reset-password"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)("token")),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.ResetPasswordDto, String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_sevice_1.AuthService,
        audit_service_1.AuditService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map