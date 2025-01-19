import { GroupsService } from './group.service';
import { CreateGroupDto, UpdateGroupDto } from './dto/group.dto';
export declare class GroupsController {
    private readonly groupsService;
    constructor(groupsService: GroupsService);
    create(createGroupDto: CreateGroupDto, req: any): Promise<import("./group.schema").GroupDocument>;
    findAll(): Promise<import("../interfaces/populated-group.interface").PopulatedGroup[]>;
    findOne(id: string): Promise<import("../interfaces/populated-group.interface").PopulatedGroup>;
    update(id: string, updateGroupDto: UpdateGroupDto, req: any): Promise<import("../interfaces/populated-group.interface").PopulatedGroup>;
    delete(id: string, req: any): Promise<void>;
    joinGroupByUserId(groupId: string, userId: string): Promise<import("../interfaces/populated-group.interface").PopulatedGroup>;
    joinGroup(groupId: string, req: any): Promise<import("../interfaces/populated-group.interface").PopulatedGroup>;
    getUserGroups(req: any): Promise<import("../interfaces/populated-group.interface").PopulatedGroup[]>;
}
