import { Model, Types } from 'mongoose';
import { GroupDocument } from './group.schema';
import { CreateGroupDto, UpdateGroupDto } from './dto/group.dto';
import { WebSocketGateway } from '../gateways/websocket.gateway';
import { PopulatedGroup } from '../interfaces/populated-group.interface';
import { User } from '../interfaces/user.interface';
export declare class GroupsService {
    private groupModel;
    private readonly userModel;
    private readonly wsGateway;
    constructor(groupModel: Model<GroupDocument>, userModel: Model<User>, wsGateway: WebSocketGateway);
    create(createGroupDto: CreateGroupDto, userId: Types.ObjectId): Promise<GroupDocument>;
    findAll(status?: 'public' | 'private'): Promise<any[]>;
    findOne(id: string): Promise<PopulatedGroup>;
    update(id: string, updateGroupDto: UpdateGroupDto, userId: Types.ObjectId): Promise<PopulatedGroup>;
    delete(id: string, userId: Types.ObjectId): Promise<void>;
    joinGroup(groupId: Types.ObjectId, userId: Types.ObjectId): Promise<PopulatedGroup>;
    leaveGroup(groupId: string, userId: Types.ObjectId): Promise<void>;
    joinByUserId(groupId: string, userId: string): Promise<PopulatedGroup>;
    getUserGroupsWithMessages(userId: string): Promise<PopulatedGroup[]>;
    private mapToPopulatedGroup;
    findUserGroups(userId: string): Promise<any[]>;
    joinGroupByInvite(inviteToken: string, userId: Types.ObjectId): Promise<import("mongoose").FlattenMaps<GroupDocument> & Required<{
        _id: import("mongoose").FlattenMaps<unknown>;
    }> & {
        __v: number;
    }>;
    generateInviteLink(groupId: Types.ObjectId, userId: Types.ObjectId): Promise<{
        inviteLink: string;
    }>;
}
