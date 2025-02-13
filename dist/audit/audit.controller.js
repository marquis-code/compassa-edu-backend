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
exports.AuditController = void 0;
const common_1 = require("@nestjs/common");
const audit_service_1 = require("./audit.service");
const audit_schema_1 = require("./audit.schema");
let AuditController = class AuditController {
    constructor(auditService) {
        this.auditService = auditService;
    }
    async getAuditLogs(action, module, userId, startDate, endDate, page = 1, limit = 10) {
        return this.auditService.getAuditLogs({
            action,
            module,
            userId,
            startDate,
            endDate,
            page: Number(page),
            limit: Number(limit),
        });
    }
};
exports.AuditController = AuditController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('action')),
    __param(1, (0, common_1.Query)('module')),
    __param(2, (0, common_1.Query)('userId')),
    __param(3, (0, common_1.Query)('startDate')),
    __param(4, (0, common_1.Query)('endDate')),
    __param(5, (0, common_1.Query)('page')),
    __param(6, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "getAuditLogs", null);
exports.AuditController = AuditController = __decorate([
    (0, common_1.Controller)('admin/audit'),
    __metadata("design:paramtypes", [audit_service_1.AuditService])
], AuditController);
//# sourceMappingURL=audit.controller.js.map