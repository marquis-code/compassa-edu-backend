/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferrawdoctype" />
import { Model, Types } from 'mongoose';
import { Group } from './group.schema';
import { CreateGroupDto, UpdateGroupDto } from './dto/group.dto';
import { WebSocketGateway } from '../gateways/websocket.gateway';
export declare class GroupsService {
    private groupModel;
    private readonly wsGateway;
    constructor(groupModel: Model<Group>, wsGateway: WebSocketGateway);
    create(createGroupDto: CreateGroupDto, userId: Types.ObjectId): Promise<Group>;
    findAll(status?: 'public' | 'private'): Promise<Group[]>;
    findOne(id: string): Promise<Group>;
    update(id: string, updateGroupDto: UpdateGroupDto, userId: Types.ObjectId): Promise<Group>;
    delete(id: string, userId: Types.ObjectId): Promise<void>;
    joinGroup(groupId: string, userId: Types.ObjectId): Promise<Group>;
    leaveGroup(groupId: string, userId: Types.ObjectId): Promise<void>;
    joinByUserId(groupId: string, userId: string): Promise<Group>;
}
