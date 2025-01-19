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
exports.WebSocketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const ws_jwt_guard_1 = require("../auth/ws-jwt.guard");
let WebSocketGateway = class WebSocketGateway {
    constructor() {
        this.userSockets = new Map();
    }
    async handleConnection(client) {
        const userId = client.handshake.query.userId;
        this.userSockets.set(userId, client.id);
    }
    handleDisconnect(client) {
        var _a;
        const userId = (_a = Array.from(this.userSockets.entries())
            .find(([_, socketId]) => socketId === client.id)) === null || _a === void 0 ? void 0 : _a[0];
        if (userId) {
            this.userSockets.delete(userId);
        }
    }
    handleJoinGroup(client, groupId) {
        client.join(`group-${groupId}`);
    }
    handleLeaveGroup(client, groupId) {
        client.leave(`group-${groupId}`);
    }
    notifyGroupMembers(groupId, event, data) {
        this.server.to(`group-${groupId}`).emit(event, data);
    }
};
exports.WebSocketGateway = WebSocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], WebSocketGateway.prototype, "server", void 0);
__decorate([
    (0, common_1.UseGuards)(ws_jwt_guard_1.WsJwtGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], WebSocketGateway.prototype, "handleConnection", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinGroup'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], WebSocketGateway.prototype, "handleJoinGroup", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveGroup'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], WebSocketGateway.prototype, "handleLeaveGroup", null);
exports.WebSocketGateway = WebSocketGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    })
], WebSocketGateway);
//# sourceMappingURL=websocket.gateway.js.map