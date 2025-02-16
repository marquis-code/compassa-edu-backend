import { GroupsService } from './group.service';
import { CreateGroupDto, UpdateGroupDto } from './dto/group.dto';
export declare class GroupsController {
    private readonly groupsService;
    constructor(groupsService: GroupsService);
    create(createGroupDto: CreateGroupDto, req: any): Promise<import("./group.schema").GroupDocument>;
    createGroup(createGroupDto: CreateGroupDto & {
        matricNumbers: string[];
    }, req: any): Promise<import("./group.schema").GroupDocument>;
    getUserGroups(req: any): Promise<any[]>;
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<import("../interfaces/populated-group.interface").PopulatedGroup>;
    update(id: string, updateGroupDto: UpdateGroupDto, req: any): Promise<import("../interfaces/populated-group.interface").PopulatedGroup>;
    delete(id: string, req: any): Promise<void>;
    joinGroupByUserId(groupId: string, userId: string): Promise<import("../interfaces/populated-group.interface").PopulatedGroup>;
    leaveGroupByUserId(groupId: string, userId: string): Promise<void>;
    joinGroup(groupId: string, req: any): Promise<import("../interfaces/populated-group.interface").PopulatedGroup>;
    joinGroupByInvite(inviteToken: string, req: any): Promise<import("mongoose").FlattenMaps<import("./group.schema").GroupDocument> & Required<{
        _id: import("mongoose").FlattenMaps<unknown>;
    }> & {
        __v: number;
    }>;
    generateInviteLink(groupId: string, req: any): Promise<{
        inviteLink: string;
    }>;
}
