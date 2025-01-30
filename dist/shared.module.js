"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedModule = void 0;
const common_1 = require("@nestjs/common");
const websocket_gateway_1 = require("./gateways/websocket.gateway");
const auth_module_1 = require("./auth/auth.module");
const group_module_1 = require("./group/group.module");
const messages_module_1 = require("./message/messages.module");
let SharedModule = class SharedModule {
};
exports.SharedModule = SharedModule;
exports.SharedModule = SharedModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            (0, common_1.forwardRef)(() => group_module_1.GroupsModule),
            (0, common_1.forwardRef)(() => messages_module_1.MessagesModule)
        ],
        providers: [websocket_gateway_1.WebSocketGateway],
        exports: [websocket_gateway_1.WebSocketGateway],
    })
], SharedModule);
//# sourceMappingURL=shared.module.js.map