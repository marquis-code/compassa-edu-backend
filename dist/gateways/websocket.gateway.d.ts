import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Types } from 'mongoose';
export declare class WebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private userSockets;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleJoinGroup(client: Socket, groupId: string): void;
    handleLeaveGroup(client: Socket, groupId: string): void;
    handleNewMessage(client: Socket, payload: any): void;
    handleFetchMessages(client: Socket, payload: any): void;
    notifyGroupMembers(groupId: Types.ObjectId, event: string, data: any): void;
}
