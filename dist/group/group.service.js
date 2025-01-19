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
exports.GroupsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const group_schema_1 = require("./group.schema");
const websocket_gateway_1 = require("../gateways/websocket.gateway");
let GroupsService = class GroupsService {
    constructor(groupModel, wsGateway) {
        this.groupModel = groupModel;
        this.wsGateway = wsGateway;
    }
    async create(createGroupDto, userId) {
        const group = new this.groupModel(Object.assign(Object.assign({}, createGroupDto), { creator: userId, members: [userId] }));
        return group.save();
    }
    async findAll(status) {
        const query = status ? { status } : {};
        return this.groupModel.find(query).populate('members', 'username email');
    }
    async findOne(id) {
        const group = await this.groupModel.findById(id).populate('members', 'username email');
        if (!group)
            throw new common_1.NotFoundException('Group not found');
        return group;
    }
    async update(id, updateGroupDto, userId) {
        const group = await this.findOne(id);
        if (group.creator.toString() !== userId.toString()) {
            throw new common_1.ForbiddenException('Only group creator can update group');
        }
        return this.groupModel.findByIdAndUpdate(id, updateGroupDto, { new: true });
    }
    async delete(id, userId) {
        const group = await this.findOne(id);
        if (group.creator.toString() !== userId.toString()) {
            throw new common_1.ForbiddenException('Only group creator can delete group');
        }
        await this.groupModel.findByIdAndDelete(id);
    }
    async joinGroup(groupId, userId) {
        const group = await this.findOne(groupId);
        if (group.status === 'private') {
            throw new common_1.ForbiddenException('Cannot join private group without invitation');
        }
        if (!group.members.includes(userId)) {
            group.members.push(userId);
            await group.save();
        }
        return group;
    }
    async leaveGroup(groupId, userId) {
        const group = await this.findOne(groupId);
        if (group.creator.toString() === userId.toString()) {
            throw new common_1.ForbiddenException('Group creator cannot leave the group');
        }
        group.members = group.members.filter(member => member.toString() !== userId.toString());
        await group.save();
    }
    async joinByUserId(groupId, userId) {
        const group = await this.groupModel.findById(groupId);
        if (!group) {
            throw new common_1.NotFoundException('Group not found');
        }
        const userObjectId = new mongoose_2.Types.ObjectId(userId);
        if (!group.members.some(member => new mongoose_2.Types.ObjectId(member).equals(userObjectId))) {
            group.members.push(userObjectId);
            await group.save();
        }
        return group;
    }
};
exports.GroupsService = GroupsService;
exports.GroupsService = GroupsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(group_schema_1.Group.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        websocket_gateway_1.WebSocketGateway])
], GroupsService);
//# sourceMappingURL=group.service.js.map