import { Model } from "mongoose";
import { Request } from "express";
import { User, UserDocument } from "../user/user.schema";
import { UserService } from "../user/user.service";
import { SignupDto, LoginDto, UpdatePasswordDto, ResetPasswordDto } from "./auth.dto";
export declare class AuthService {
    private readonly User;
    private readonly userService;
    constructor(User: Model<UserDocument>, userService: UserService);
    signup(dto: SignupDto): Promise<{
        user: User;
    }>;
    login(dto: LoginDto): Promise<{
        token: string;
        user: import("mongoose").Document<unknown, {}, UserDocument> & import("mongoose").Document<unknown, {}, User> & User & {
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
        user: import("mongoose").Document<unknown, {}, UserDocument> & import("mongoose").Document<unknown, {}, User> & User & {
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
    updatePassword(dto: UpdatePasswordDto, currentUser: UserDocument): Promise<{
        user: import("mongoose").Document<unknown, {}, UserDocument> & import("mongoose").Document<unknown, {}, User> & User & {
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
