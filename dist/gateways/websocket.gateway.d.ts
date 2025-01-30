import { OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Types } from 'mongoose';
import { GroupsService } from 'src/group/group.service';
import { MessagesService } from 'src/message/message.service';
export declare class WebSocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly groupsService;
    private readonly messagesService;
    server: Server;
    logger: Logger;
    notifyGroupMembers(groupId: Types.ObjectId, event: string, data: any): void;
    constructor(groupsService: GroupsService, messagesService: MessagesService);
    afterInit(server: Server): void;
    private userSockets;
    handleConnection(client: Socket): Promise<void>;
    fetchAndJoinGroups(userId: string, client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleJoinGroup(client: Socket, groupId: string): void;
    handleNewMessage(client: Socket, payload: any): Promise<void>;
}
