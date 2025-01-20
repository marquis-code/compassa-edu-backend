import { Request } from "express";
import { UserDocument } from "../user/user.schema";
import { SignupDto, LoginDto, UpdatePasswordDto, ResetPasswordDto } from "./auth.dto";
import { AuthService } from "./auth.sevice";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signup(dto: SignupDto): Promise<{
        user: import("../user/user.schema").User;
    }>;
    login(dto: LoginDto): Promise<{
        token: string;
        user: import("mongoose").Document<unknown, {}, UserDocument> & import("mongoose").Document<unknown, {}, import("../user/user.schema").User> & import("../user/user.schema").User & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            matchPassword: (password: string) => Promise<boolean>;
            getSignedJwtToken: () => string;
            getResetPasswordToken: () => string;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>;
    }>;
    getCurrentUser(user: UserDocument): {
        user: UserDocument;
    };
    updatePassword(dto: UpdatePasswordDto, user: UserDocument): Promise<{
        user: import("mongoose").Document<unknown, {}, UserDocument> & import("mongoose").Document<unknown, {}, import("../user/user.schema").User> & import("../user/user.schema").User & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            matchPassword: (password: string) => Promise<boolean>;
            getSignedJwtToken: () => string;
            getResetPasswordToken: () => string;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>;
    }>;
    forgotPassword(req: Request, email: string): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto, token: string): Promise<{
        user: import("mongoose").Document<unknown, {}, UserDocument> & import("mongoose").Document<unknown, {}, import("../user/user.schema").User> & import("../user/user.schema").User & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            matchPassword: (password: string) => Promise<boolean>;
            getSignedJwtToken: () => string;
            getResetPasswordToken: () => string;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>;
    }>;
}
