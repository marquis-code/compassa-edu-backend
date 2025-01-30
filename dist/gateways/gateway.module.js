"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayModule = void 0;
const common_1 = require("@nestjs/common");
const websocket_gateway_1 = require("./websocket.gateway");
const messages_module_1 = require("../message/messages.module");
const jwt_1 = require("@nestjs/jwt");
const group_module_1 = require("../group/group.module");
const ws_jwt_guard_1 = require("../auth/ws-jwt.guard");
let GatewayModule = class GatewayModule {
};
exports.GatewayModule = GatewayModule;
exports.GatewayModule = GatewayModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '24h' },
            }),
            (0, common_1.forwardRef)(() => messages_module_1.MessagesModule),
            (0, common_1.forwardRef)(() => group_module_1.GroupsModule),
        ],
        providers: [websocket_gateway_1.WebSocketGateway, ws_jwt_guard_1.WsJwtGuard],
        exports: [websocket_gateway_1.WebSocketGateway, ws_jwt_guard_1.WsJwtGuard],
    })
], GatewayModule);
//# sourceMappingURL=gateway.module.js.map