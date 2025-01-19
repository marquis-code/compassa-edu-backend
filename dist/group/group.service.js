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
        const groups = await this.groupModel
            .find(query)
            .populate('members', 'username email')
            .lean();
        return groups.map(group => this.mapToPopulatedGroup(group));
    }
    async findOne(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.NotFoundException('Invalid group ID');
        }
        const group = await this.groupModel
            .findById(id)
            .populate('members', 'username email')
            .lean();
        if (!group) {
            throw new common_1.NotFoundException('Group not found');
        }
        return this.mapToPopulatedGroup(group);
    }
    async update(id, updateGroupDto, userId) {
        const group = await this.findOne(id);
        if (group.creator.toString() !== userId.toString()) {
            throw new common_1.ForbiddenException('Only group creator can update group');
        }
        const updatedGroup = await this.groupModel
            .findByIdAndUpdate(id, updateGroupDto, { new: true })
            .populate('members', 'username email')
            .lean();
        return this.mapToPopulatedGroup(updatedGroup);
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
        const isMember = group.members.some(member => member._id.equals(userId));
        if (!isMember) {
            await this.groupModel.findByIdAndUpdate(groupId, { $addToSet: { members: userId } });
        }
        return this.findOne(groupId);
    }
    async leaveGroup(groupId, userId) {
        const group = await this.findOne(groupId);
        if (group.creator.toString() === userId.toString()) {
            throw new common_1.ForbiddenException('Group creator cannot leave the group');
        }
        await this.groupModel.findByIdAndUpdate(groupId, { $pull: { members: userId } });
    }
    async joinByUserId(groupId, userId) {
        if (!mongoose_2.Types.ObjectId.isValid(userId)) {
            throw new common_1.NotFoundException('Invalid user ID');
        }
        const userObjectId = new mongoose_2.Types.ObjectId(userId);
        const group = await this.findOne(groupId);
        const isMember = group.members.some(member => member._id.equals(userObjectId));
        if (!isMember) {
            await this.groupModel.findByIdAndUpdate(groupId, { $addToSet: { members: userObjectId } });
        }
        return this.findOne(groupId);
    }
    async getUserGroupsWithMessages(userId) {
        if (!mongoose_2.Types.ObjectId.isValid(userId)) {
            throw new common_1.NotFoundException('Invalid user ID');
        }
        const userObjectId = new mongoose_2.Types.ObjectId(userId);
        const groups = await this.groupModel
            .find({ members: userObjectId })
            .populate('members', 'username email')
            .populate({
            path: 'messages',
            populate: [
                {
                    path: 'sender',
                    model: 'User',
                    select: 'username email',
                },
                {
                    path: 'readBy.user',
                    model: 'User',
                    select: 'username email',
                },
            ],
        })
            .lean();
        if (!groups || groups.length === 0) {
            throw new common_1.NotFoundException('No groups found for the user');
        }
        return groups.map(group => this.mapToPopulatedGroup(group));
    }
    mapToPopulatedGroup(group) {
        var _a;
        return {
            _id: group._id,
            name: group.name,
            description: group.description,
            creator: group.creator,
            status: group.status,
            members: group.members.map((member) => ({
                _id: member._id,
                username: member.username,
                email: member.email,
            })),
            messages: ((_a = group.messages) === null || _a === void 0 ? void 0 : _a.map((message) => ({
                _id: message._id,
                content: message.content,
                type: message.type,
                sender: {
                    _id: message.sender._id,
                    username: message.sender.username,
                    email: message.sender.email,
                },
                attachments: message.attachments,
                readBy: message.readBy.map((readBy) => ({
                    user: {
                        _id: readBy.user._id,
                        username: readBy.user.username,
                        email: readBy.user.email,
                    },
                    readAt: readBy.readAt,
                })),
                createdAt: message.createdAt,
                updatedAt: message.updatedAt,
            }))) || [],
            createdAt: group.createdAt,
            updatedAt: group.updatedAt,
        };
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