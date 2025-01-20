import { Model, Types } from 'mongoose';
import { GroupDocument } from './group.schema';
import { CreateGroupDto, UpdateGroupDto } from './dto/group.dto';
import { WebSocketGateway } from '../gateways/websocket.gateway';
import { PopulatedGroup } from '../interfaces/populated-group.interface';
export declare class GroupsService {
    private groupModel;
    private readonly wsGateway;
    constructor(groupModel: Model<GroupDocument>, wsGateway: WebSocketGateway);
    create(createGroupDto: CreateGroupDto, userId: Types.ObjectId): Promise<GroupDocument>;
    findAll(status?: 'public' | 'private'): Promise<PopulatedGroup[]>;
    findOne(id: string): Promise<PopulatedGroup>;
    update(id: string, updateGroupDto: UpdateGroupDto, userId: Types.ObjectId): Promise<PopulatedGroup>;
    delete(id: string, userId: Types.ObjectId): Promise<void>;
    joinGroup(groupId: string, userId: Types.ObjectId): Promise<PopulatedGroup>;
    leaveGroup(groupId: string, userId: Types.ObjectId): Promise<void>;
    joinByUserId(groupId: string, userId: string): Promise<PopulatedGroup>;
    getUserGroupsWithMessages(userId: string): Promise<PopulatedGroup[]>;
    private mapToPopulatedGroup;
}
