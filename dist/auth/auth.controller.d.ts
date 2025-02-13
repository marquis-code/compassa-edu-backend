import { Request } from "express";
import { UserDocument } from "../user/user.schema";
import { SignupDto, LoginDto, UpdatePasswordDto, ResetPasswordDto } from "./auth.dto";
import { AuthService } from "./auth.sevice";
import { AuditService } from "../audit/audit.service";
import { Types } from "mongoose";
export declare class AuthController {
    private authService;
    private auditService;
    constructor(authService: AuthService, auditService: AuditService);
    signup(dto: SignupDto, req: Request): Promise<any>;
    login(dto: LoginDto, req: Request): Promise<{
        token: string;
        user: import("mongoose").Document<unknown, {}, UserDocument> & import("mongoose").Document<unknown, {}, import("../user/user.schema").User> & import("../user/user.schema").User & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            matchPassword: (password: string) => Promise<boolean>;
            getSignedJwtToken: () => string;
            getResetPasswordToken: () => string;
        } & Required<{
            _id: Types.ObjectId;
        }>;
    }>;
    getCurrentUser(user: UserDocument): {
        user: UserDocument;
    };
    updatePassword(dto: UpdatePasswordDto, user: UserDocument, req: Request): Promise<{
        message: string;
    }>;
    forgotPassword(req: Request, email: string): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto, token: string, req: Request): Promise<{
        message: string;
    }>;
}
