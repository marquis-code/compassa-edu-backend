"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_module_1 = require("../user/user.module");
const auth_controller_1 = require("./auth.controller");
const jwt_1 = require("@nestjs/jwt");
const auth_sevice_1 = require("./auth.sevice");
const auth_guard_1 = require("./auth.guard");
const user_schema_1 = require("../user/user.schema");
const ws_jwt_guard_1 = require("./ws-jwt.guard");
const group_module_1 = require("../group/group.module");
const audit_module_1 = require("../audit/audit.module");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: user_schema_1.User.name, schema: user_schema_1.UserSchema }]),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '1h' },
            }),
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
            (0, common_1.forwardRef)(() => group_module_1.GroupsModule),
            (0, common_1.forwardRef)(() => audit_module_1.AuditTrailModule)
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_sevice_1.AuthService, auth_guard_1.AuthGuard, ws_jwt_guard_1.WsJwtGuard],
        exports: [auth_sevice_1.AuthService, auth_guard_1.AuthGuard, ws_jwt_guard_1.WsJwtGuard, jwt_1.JwtModule],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map