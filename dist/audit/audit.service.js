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
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const audit_schema_1 = require("./audit.schema");
let AuditService = class AuditService {
    constructor(auditTrailModel) {
        this.auditTrailModel = auditTrailModel;
    }
    async logAudit(action, module, documentId, user, changes, ipAddress, userAgent, metadata) {
        const userId = user instanceof mongoose_2.Types.ObjectId ? user : user === null || user === void 0 ? void 0 : user._id;
        const auditLog = new this.auditTrailModel({
            action,
            module,
            documentId,
            user: userId,
            changes,
            metadata,
            ipAddress,
            userAgent,
        });
        await auditLog.save();
    }
    async getAuditLogs({ action, module, userId, startDate, endDate, page = 1, limit = 10, }) {
        const filter = {};
        if (action)
            filter.action = action;
        if (module)
            filter.module = module;
        if (userId)
            filter.user = new mongoose_2.Types.ObjectId(userId);
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate)
                filter.createdAt.$gte = new Date(startDate);
            if (endDate)
                filter.createdAt.$lte = new Date(endDate);
        }
        const logs = await this.auditTrailModel
            .find(filter)
            .populate('user', 'name email role')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
        const total = await this.auditTrailModel.countDocuments(filter);
        return {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
            logs,
        };
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(audit_schema_1.AuditTrail.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AuditService);
//# sourceMappingURL=audit.service.js.map