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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = exports.User = exports.UserRole = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const jsonwebtoken_1 = require("jsonwebtoken");
const bcryptjs_1 = require("bcryptjs");
const crypto_1 = require("crypto");
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["USER"] = "user";
})(UserRole || (exports.UserRole = UserRole = {}));
let User = class User {
};
exports.User = User;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, minlength: 6, select: false }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "matric", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "points", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "resetPasswordToken", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], User.prototype, "resetPasswordExpire", void 0);
__decorate([
    (0, mongoose_1.Prop)([{ type: mongoose_2.Types.ObjectId, ref: "Materials" }]),
    __metadata("design:type", Array)
], User.prototype, "uploadedMaterials", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Types.ObjectId, ref: 'Group' }] }),
    __metadata("design:type", Array)
], User.prototype, "groups", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: UserRole,
        default: UserRole.USER,
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
exports.User = User = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], User);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);
exports.UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await (0, bcryptjs_1.compare)(enteredPassword, this.password);
};
exports.UserSchema.methods.getSignedJwtToken = function () {
    console.log('Generating token for user ID:', this._id);
    const secret = process.env.JWT_SECRET;
    const expiresIn = 3600;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }
    const options = { expiresIn };
    return (0, jsonwebtoken_1.sign)({ id: this._id }, secret, options);
};
exports.UserSchema.methods.getResetPasswordToken = function () {
    const token = (0, crypto_1.randomBytes)(20).toString("base64url");
    this.resetPasswordToken = (0, crypto_1.createHash)("sha256").update(token).digest("hex");
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    return token;
};
exports.UserSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    const salt = await (0, bcryptjs_1.genSalt)(10);
    this.password = await (0, bcryptjs_1.hash)(this.password, salt);
    next();
});
//# sourceMappingURL=user.schema.js.map