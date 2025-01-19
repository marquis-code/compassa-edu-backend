export declare class CreateGroupDto {
    name: string;
    description: string;
    status?: 'public' | 'private';
}
export declare class UpdateGroupDto {
    name?: string;
    description?: string;
    status?: 'public' | 'private';
}
