"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const crypto_1 = require("crypto");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const sendEmail_1 = require("../utils/sendEmail");
const user_schema_1 = require("../user/user.schema");
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
let AuthService = class AuthService {
    constructor(User, userService) {
        this.User = User;
        this.userService = userService;
    }
    async signup(dto) {
        return await this.userService.createUser(dto);
    }
    async login(dto) {
        const user = await this.User.findOne({ matric: dto.matric }).select("+password");
        if (!user)
            throw new common_1.NotFoundException("No user exists with the entered matric");
        const isMatch = await user.matchPassword(dto.password);
        if (!isMatch)
            throw new common_1.BadRequestException("Invalid password");
        user.password = undefined;
        return { token: user.getSignedJwtToken(), user };
    }
    async forgotPassword(req, email) {
        const user = await this.User.findOne({ email });
        if (!user)
            throw new common_1.NotFoundException("No user exists with the entered email");
        const token = user.getResetPasswordToken();
        await user.save();
        const resetURL = `${req.protocol}://${req.get("host")}/api/v1/auth/reset-password?token=${token}`;
        const message = `Dear ${user.name}, <br /><br />Please use the following link to reset your password: <a href="${resetURL}" target="_blank">${resetURL}</a>.`;
        try {
            await (0, sendEmail_1.sendEmail)({
                subject: "Password Reset",
                to: email,
                html: message,
            });
        }
        catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            throw new common_1.InternalServerErrorException("Email could not be sent");
        }
        return { message: "Please check your email" };
    }
    async resetPassword(dto, token) {
        if (!token)
            throw new common_1.BadRequestException("Invalid password reset token");
        const resetPasswordToken = (0, crypto_1.createHash)("sha256").update(token).digest("hex");
        const user = await this.User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });
        if (!user)
            throw new common_1.BadRequestException("Invalid or expired token");
        user.password = dto.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        user.password = undefined;
        return { user };
    }
    async updatePassword(dto, currentUser) {
        const user = await this.User.findById(currentUser._id).select("+password");
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        const isMatch = await user.matchPassword(dto.password);
        if (!isMatch) {
            throw new common_1.BadRequestException("Invalid current password");
        }
        user.password = dto.newPassword;
        await user.save();
        user.password = undefined;
        return { user };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        user_service_1.UserService])
], AuthService);
//# sourceMappingURL=auth.sevice.js.map