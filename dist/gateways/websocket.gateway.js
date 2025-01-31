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
exports.WebSocketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const common_2 = require("@nestjs/common");
const ws_jwt_guard_1 = require("../auth/ws-jwt.guard");
const mongoose_1 = require("mongoose");
const group_service_1 = require("../group/group.service");
const message_service_1 = require("../message/message.service");
let WebSocketGateway = class WebSocketGateway {
    notifyGroupMembers(groupId, event, data) {
        console.log(`Notifying group members in room group-${groupId}kkkkkkkkkkk: Event: ${event} data: ${data}`);
        this.server.to(`group-${groupId.toString()}`).emit(event, data);
    }
    constructor(groupsService, messagesService) {
        this.groupsService = groupsService;
        this.messagesService = messagesService;
        this.logger = new common_1.Logger('WebSocketGateway');
        this.userSockets = new Map();
    }
    afterInit(server) {
        console.log('Init');
    }
    async handleConnection(client) {
        const userId = client.handshake.query.userId;
        if (userId) {
            this.userSockets.set(userId, client.id);
            this.logger.log(`User ${userId} connected with socket ID: ${client.id}`);
            this.fetchAndJoinGroups(userId, client);
        }
    }
    async fetchAndJoinGroups(userId, client) {
        try {
            const groups = await this.groupsService.findUserGroups(userId);
            this.logger.log(`User ${userId} belongs to groups: ${JSON.stringify(groups)}`);
            groups.forEach((group) => {
                this.handleJoinGroup(client, group.id);
            });
        }
        catch (error) {
            this.logger.error(`Failed to fetch and join groups for user ${userId}`, error.stack);
        }
    }
    handleDisconnect(client) {
        var _a;
        const userId = (_a = Array.from(this.userSockets.entries()).find(([_, socketId]) => socketId === client.id)) === null || _a === void 0 ? void 0 : _a[0];
        if (userId) {
            this.userSockets.delete(userId);
            this.logger.log(`User ${userId} disconnected`);
        }
    }
    handleJoinGroup(client, groupId) {
        this.logger.log(`Received joinGroup event from client ${client.id} for group ${groupId}`);
        if (!mongoose_1.Types.ObjectId.isValid(groupId)) {
            this.logger.warn(`Invalid groupId: ${groupId}`);
            client.emit('error', { error: 'Invalid groupId' });
            return;
        }
        client.join(groupId);
        client.emit('joined-group', { groupId });
        this.logger.log(`Client ${client.id} joined room group-${groupId}`);
        this.server.to(groupId).emit('group.update', {
            message: `A user has joined the group: ${groupId}`,
        });
    }
    async handleNewMessage(client, payload) {
        this.logger.log('Received payload:', payload);
        if (!payload.groupId || !payload.content || !payload.senderId) {
            const errorMsg = 'Missing required fields';
            this.logger.warn(errorMsg);
            client.emit('error', { error: errorMsg });
            return;
        }
        if (!mongoose_1.Types.ObjectId.isValid(payload.groupId) || !mongoose_1.Types.ObjectId.isValid(payload.senderId)) {
            const errorMsg = 'Invalid groupId or senderId format';
            this.logger.warn(errorMsg);
            client.emit('error', { error: errorMsg });
            return;
        }
        try {
            this.logger.log('Creating new message:', payload);
            const chat = await this.messagesService.create(payload, payload.senderId);
            this.server.to(payload.groupId).emit('receive-message', payload);
            client.emit('message-sent', { success: true, messageId: chat._id, payload });
        }
        catch (error) {
            this.logger.error('Error creating message:', error);
            client.emit('error', { error: 'Failed to create message', details: error.message });
        }
    }
};
exports.WebSocketGateway = WebSocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], WebSocketGateway.prototype, "server", void 0);
__decorate([
    (0, common_2.UseGuards)(ws_jwt_guard_1.WsJwtGuard),
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
    (0, websockets_1.SubscribeMessage)('message.new'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], WebSocketGateway.prototype, "handleNewMessage", null);
exports.WebSocketGateway = WebSocketGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    }),
    __param(0, (0, common_2.Inject)((0, common_2.forwardRef)(() => group_service_1.GroupsService))),
    __param(1, (0, common_2.Inject)((0, common_2.forwardRef)(() => message_service_1.MessagesService))),
    __metadata("design:paramtypes", [group_service_1.GroupsService,
        message_service_1.MessagesService])
], WebSocketGateway);
//# sourceMappingURL=websocket.gateway.js.map