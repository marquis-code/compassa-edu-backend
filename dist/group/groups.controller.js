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
exports.GroupsController = void 0;
const common_1 = require("@nestjs/common");
const group_service_1 = require("./group.service");
const group_dto_1 = require("./dto/group.dto");
const auth_guard_1 = require("../auth/auth.guard");
const mongoose_1 = require("mongoose");
const logger = new common_1.Logger('Bootstrap');
let GroupsController = class GroupsController {
    constructor(groupsService) {
        this.groupsService = groupsService;
    }
    create(createGroupDto, req) {
        return this.groupsService.create(createGroupDto, req.user.id);
    }
    getUserGroups(req) {
        logger.log('Request Object:', req);
        logger.log('Request User Object:', req.user);
        logger.log('User ID from request:', req.user.id);
        const userId = req.user.id;
        return this.groupsService.findUserGroups(userId);
    }
    findAll() {
        return this.groupsService.findAll();
    }
    findOne(id) {
        return this.groupsService.findOne(id);
    }
    update(id, updateGroupDto, req) {
        return this.groupsService.update(id, updateGroupDto, req.user.id);
    }
    delete(id, req) {
        return this.groupsService.delete(id, req.user.id);
    }
    joinGroupByUserId(groupId, userId) {
        return this.groupsService.joinByUserId(groupId, userId);
    }
    leaveGroupByUserId(groupId, userId) {
        return this.groupsService.leaveGroup(groupId, new mongoose_1.Types.ObjectId(userId));
    }
    joinGroup(groupId, req) {
        const groupObjectId = new mongoose_1.Types.ObjectId(groupId);
        return this.groupsService.joinGroup(groupObjectId, req.user.id);
    }
    async joinGroupByInvite(inviteToken, req) {
        return this.groupsService.joinGroupByInvite(inviteToken, new mongoose_1.Types.ObjectId(req.user.id));
    }
    async generateInviteLink(groupId, req) {
        return this.groupsService.generateInviteLink(new mongoose_1.Types.ObjectId(groupId), new mongoose_1.Types.ObjectId(req.user.id));
    }
};
exports.GroupsController = GroupsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [group_dto_1.CreateGroupDto, Object]),
    __metadata("design:returntype", void 0)
], GroupsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('my-groups'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GroupsController.prototype, "getUserGroups", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GroupsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GroupsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, group_dto_1.UpdateGroupDto, Object]),
    __metadata("design:returntype", void 0)
], GroupsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], GroupsController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)('join-by-user/:groupId/:userId'),
    __param(0, (0, common_1.Param)('groupId')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], GroupsController.prototype, "joinGroupByUserId", null);
__decorate([
    (0, common_1.Post)('leave-group/:groupId/:userId'),
    __param(0, (0, common_1.Param)('groupId')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], GroupsController.prototype, "leaveGroupByUserId", null);
__decorate([
    (0, common_1.Post)('join/:groupId'),
    __param(0, (0, common_1.Param)('groupId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], GroupsController.prototype, "joinGroup", null);
__decorate([
    (0, common_1.Post)('join-by-invite/:inviteToken'),
    __param(0, (0, common_1.Param)('inviteToken')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GroupsController.prototype, "joinGroupByInvite", null);
__decorate([
    (0, common_1.Post)('generate-invite/:groupId'),
    __param(0, (0, common_1.Param)('groupId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GroupsController.prototype, "generateInviteLink", null);
exports.GroupsController = GroupsController = __decorate([
    (0, common_1.Controller)('groups'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [group_service_1.GroupsService])
], GroupsController);
//# sourceMappingURL=groups.controller.js.map