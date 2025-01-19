import { GroupsService } from './group.service';
import { CreateGroupDto, UpdateGroupDto } from './dto/group.dto';
export declare class GroupsController {
    private readonly groupsService;
    constructor(groupsService: GroupsService);
    create(createGroupDto: CreateGroupDto, req: any): Promise<import("./group.schema").Group>;
    findAll(): Promise<import("./group.schema").Group[]>;
    findOne(id: string): Promise<import("./group.schema").Group>;
    update(id: string, updateGroupDto: UpdateGroupDto, req: any): Promise<import("./group.schema").Group>;
    delete(id: string, req: any): Promise<void>;
    joinGroupByUserId(groupId: string, userId: string): Promise<import("./group.schema").Group>;
    joinGroup(groupId: string, req: any): Promise<import("./group.schema").Group>;
}
