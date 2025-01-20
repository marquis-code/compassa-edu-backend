import { Model } from 'mongoose';
import { Message } from './message.schema';
import { CreateMessageDto } from './dto/message.dto';
import { WebSocketGateway } from '../gateways/websocket.gateway';
export declare class MessagesService {
    private messageModel;
    private readonly wsGateway;
    constructor(messageModel: Model<Message>, wsGateway: WebSocketGateway);
    create(createMessageDto: CreateMessageDto, userId: string): Promise<Message>;
    findGroupMessages(groupId: string): Promise<Message[]>;
    getUnreadMessages(groupId: string, userId: string): Promise<Message[]>;
    markMessagesAsRead(groupId: string, userId: string): Promise<void>;
}
