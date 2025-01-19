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
const mongoose_1 = require("mongoose");
let WebSocketGateway = class WebSocketGateway {
    constructor() {
        this.userSockets = new Map();
    }
    async handleConnection(client) {
        const userId = client.handshake.query.userId;
        if (userId) {
            this.userSockets.set(userId, client.id);
            console.log(`User ${userId} connected`);
        }
    }
    handleDisconnect(client) {
        var _a;
        const userId = (_a = Array.from(this.userSockets.entries())
            .find(([_, socketId]) => socketId === client.id)) === null || _a === void 0 ? void 0 : _a[0];
        if (userId) {
            this.userSockets.delete(userId);
            console.log(`User ${userId} disconnected`);
        }
    }
    handleJoinGroup(client, groupId) {
        console.log(`User joined group: ${groupId}`);
        client.join(`group-${groupId}`);
        this.server.to(`group-${groupId}`).emit('group.update', {
            message: `A user has joined the group: ${groupId}`,
        });
    }
    handleLeaveGroup(client, groupId) {
        console.log(`User left group: ${groupId}`);
        client.leave(`group-${groupId}`);
        this.server.to(`group-${groupId}`).emit('group.update', {
            message: `A user has left the group: ${groupId}`,
        });
    }
    handleNewMessage(client, payload) {
        const { groupId, content, senderId, type = 'text' } = payload;
        if (!groupId || !content || !senderId) {
            console.error('Invalid message payload', payload);
            return;
        }
        const message = {
            id: new mongoose_1.Types.ObjectId().toString(),
            groupId,
            content,
            senderId,
            type,
            timestamp: new Date().toISOString(),
        };
        console.log('New message:', message);
        this.server.to(`group-${groupId}`).emit('message.new', { message });
    }
    handleFetchMessages(client, payload) {
        const { groupId } = payload;
        if (!groupId) {
            console.error('Invalid groupId in messages.fetch payload', payload);
            return;
        }
        const messages = [
            {
                id: new mongoose_1.Types.ObjectId().toString(),
                groupId,
                content: 'Welcome to the group chat!',
                senderId: 'system',
                type: 'text',
                timestamp: new Date().toISOString(),
            },
        ];
        console.log(`Messages fetched for group ${groupId}:`, messages);
        client.emit('messages.update', messages);
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
__decorate([
    (0, websockets_1.SubscribeMessage)('message.new'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], WebSocketGateway.prototype, "handleNewMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('messages.fetch'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], WebSocketGateway.prototype, "handleFetchMessages", null);
exports.WebSocketGateway = WebSocketGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    })
], WebSocketGateway);
//# sourceMappingURL=websocket.gateway.js.map