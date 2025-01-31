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
var MessagesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const message_schema_1 = require("./message.schema");
const websocket_gateway_1 = require("../gateways/websocket.gateway");
let MessagesService = MessagesService_1 = class MessagesService {
    constructor(messageModel, wsGateway) {
        this.messageModel = messageModel;
        this.wsGateway = wsGateway;
        this.logger = new common_1.Logger(MessagesService_1.name);
    }
    async create(createMessageDto, userId) {
        this.logger.log('Starting to create a message');
        const { content, group, attachments = [], type = 'text' } = createMessageDto;
        const groupId = new mongoose_2.Types.ObjectId(group);
        const senderId = new mongoose_2.Types.ObjectId(userId);
        this.logger.debug(`Creating message for group: ${groupId} by user: ${senderId}`);
        const message = new this.messageModel({
            content,
            group: groupId,
            sender: senderId,
            attachments,
            type,
        });
        let savedMessage = await message.save();
        savedMessage = await this.messageModel.findById(savedMessage._id).populate('sender').populate('group');
        this.logger.debug(`Saved Message: ${JSON.stringify(savedMessage)}`);
        this.wsGateway.notifyGroupMembers(groupId, 'message.new', savedMessage);
        return savedMessage;
    }
    async findGroupMessages(groupId) {
        const messages = await this.messageModel
            .find({ group: new mongoose_2.Types.ObjectId(groupId) })
            .populate('sender', 'username')
            .sort({ createdAt: 1 });
        return messages;
    }
    async getUnreadMessages(groupId, userId) {
        const unreadMessages = await this.messageModel
            .find({
            group: new mongoose_2.Types.ObjectId(groupId),
            'readBy.user': { $ne: new mongoose_2.Types.ObjectId(userId) },
        })
            .populate('sender', 'username')
            .sort({ createdAt: 1 });
        return unreadMessages;
    }
    async markMessagesAsRead(groupId, userId) {
        this.logger.log(`Marking messages3 as read for group: ${groupId} and user: ${userId}`);
        const result = await this.messageModel.updateMany({
            group: new mongoose_2.Types.ObjectId(groupId),
            'readBy.user': { $ne: new mongoose_2.Types.ObjectId(userId) },
        }, {
            $push: { readBy: { user: new mongoose_2.Types.ObjectId(userId), readAt: new Date() } },
        });
        this.logger.log(`Marked messages as read for user: ${userId}`);
        this.logger.debug(`Update result: ${JSON.stringify(result)}`);
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = MessagesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(message_schema_1.Message.name)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => websocket_gateway_1.WebSocketGateway))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        websocket_gateway_1.WebSocketGateway])
], MessagesService);
//# sourceMappingURL=message.service.js.map