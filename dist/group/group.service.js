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
    constructor(groupModel, userModel, wsGateway) {
        this.groupModel = groupModel;
        this.userModel = userModel;
        this.wsGateway = wsGateway;
    }
    async create(createGroupDto, userId) {
        const group = new this.groupModel(Object.assign(Object.assign({}, createGroupDto), { status: createGroupDto.status || 'public', creator: userId, members: [userId] }));
        console.log('Creating group with members:', group.members);
        const savedGroup = await group.save();
        await this.userModel.findByIdAndUpdate(userId, {
            $addToSet: { groups: savedGroup._id },
        });
        return savedGroup;
    }
    async findAll(status) {
        const query = status ? { status } : {};
        const groups = await this.groupModel.find(query).lean();
        return groups;
    }
    async findOne(id) {
        console.log('Validating group ID:', id);
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.NotFoundException(`Invalid group ID: ${id}`);
        }
        const group = await this.groupModel
            .findById(id)
            .populate('members', 'username email')
            .lean();
        if (!group) {
            throw new common_1.NotFoundException(`Group not found with ID: ${id}`);
        }
        console.log('Group members:', group.members);
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
        console.log(groupId, 'group id');
        console.log(userId, 'user id');
        const group = await this.groupModel.findById(groupId);
        if (!group) {
            throw new common_1.NotFoundException('Group not found');
        }
        if (group.status === 'private') {
            throw new common_1.ForbiddenException('Cannot join a private group without an invitation');
        }
        const isMember = group.members.some((member) => { var _a, _b; return (_b = (_a = member._id) === null || _a === void 0 ? void 0 : _a.equals) === null || _b === void 0 ? void 0 : _b.call(_a, userId); });
        if (!isMember) {
            await this.groupModel.findByIdAndUpdate(groupId, {
                $addToSet: { members: userId },
            });
            await this.userModel.findByIdAndUpdate(userId, {
                $addToSet: { groups: groupId },
            });
        }
        return this.groupModel
            .findById(groupId)
            .populate('members')
            .lean();
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
        const isMember = group.members.some((member) => { var _a; return ((_a = member === null || member === void 0 ? void 0 : member._id) === null || _a === void 0 ? void 0 : _a.toString()) === userObjectId.toString(); });
        if (!isMember) {
            await this.groupModel.findByIdAndUpdate(groupId, { $addToSet: { members: userObjectId } }, { new: true });
        }
        return this.findOne(groupId);
    }
    async getUserGroupsWithMessages(userId) {
        if (!mongoose_2.Types.ObjectId.isValid(userId)) {
            throw new common_1.NotFoundException(`Invalid user ID: ${userId}`);
        }
        const groups = await this.groupModel
            .find({ members: new mongoose_2.Types.ObjectId(userId) })
            .populate('members', 'username email')
            .populate({
            path: 'messages',
            populate: [
                { path: 'sender', model: 'User', select: 'username email' },
                { path: 'readBy.user', model: 'User', select: 'username email' },
            ],
        })
            .lean();
        if (!groups || groups.length === 0) {
            throw new common_1.NotFoundException(`No groups found for user ID: ${userId}`);
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
            members: ((_a = group.members) === null || _a === void 0 ? void 0 : _a.map((member) => ({
                _id: (member === null || member === void 0 ? void 0 : member._id) || 'Unknown',
                username: (member === null || member === void 0 ? void 0 : member.username) || 'Unknown',
                email: (member === null || member === void 0 ? void 0 : member.email) || 'Unknown',
            }))) || [],
            messages: group.messages || [],
            createdAt: group.createdAt,
            updatedAt: group.updatedAt,
        };
    }
    async findUserGroups(userId) {
        console.log(userId, 'uer if from user grope');
        if (!mongoose_2.Types.ObjectId.isValid(userId)) {
            throw new common_1.NotFoundException(`Invalid user ID: ${userId}`);
        }
        const userObjectId = new mongoose_2.Types.ObjectId(userId);
        const groups = await this.groupModel
            .find({ members: userId })
            .lean();
        return groups;
    }
    async joinGroupByInvite(inviteToken, userId) {
        const group = await this.groupModel.findOne({ inviteToken });
        if (!group) {
            throw new common_1.NotFoundException('Invalid or expired invite link');
        }
        const isMember = group.members.some((member) => member.equals(userId));
        if (isMember) {
            throw new common_1.BadRequestException('You are already a member of this group');
        }
        await this.groupModel.findByIdAndUpdate(group._id, {
            $addToSet: { members: userId },
        });
        await this.userModel.findByIdAndUpdate(userId, {
            $addToSet: { groups: group._id },
        });
        return this.groupModel.findById(group._id).populate('members').lean();
    }
    async generateInviteLink(groupId, userId) {
        const group = await this.groupModel.findById(groupId);
        if (!group) {
            throw new common_1.NotFoundException('Group not found');
        }
        if (!group.creator.equals(userId)) {
            throw new common_1.ForbiddenException('Only the group creator can generate invite links');
        }
        const inviteToken = new mongoose_2.Types.ObjectId().toHexString();
        await this.groupModel.findByIdAndUpdate(groupId, { inviteToken });
        return {
            inviteLink: `${process.env.APP_URL}/join-by-invite/${inviteToken}`,
        };
    }
};
exports.GroupsService = GroupsService;
exports.GroupsService = GroupsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(group_schema_1.Group.name)),
    __param(1, (0, mongoose_1.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        websocket_gateway_1.WebSocketGateway])
], GroupsService);
//# sourceMappingURL=group.service.js.map