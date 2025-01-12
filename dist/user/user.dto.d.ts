export declare enum UserRole {
    ADMIN = "admin",
    USER = "user"
}
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    phone: string;
    matric: string;
    points?: number;
    uploadedMaterials?: string[];
    role?: UserRole;
}
export declare class UpdateUserDto {
    name?: string;
    email?: string;
    password?: string;
    phone?: string;
    matric?: string;
    uploads?: string[];
    role?: UserRole;
}
