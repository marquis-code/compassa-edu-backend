import {
    WebSocketGateway as WsGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { UseGuards } from '@nestjs/common';
  import { WsJwtGuard } from '../auth/ws-jwt.guard';
  import { Types } from 'mongoose';
  
  @WsGateway({
    cors: {
      origin: '*',
    },
  })
  export class WebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    private userSockets: Map<string, string> = new Map();
  
    @UseGuards(WsJwtGuard)
    async handleConnection(client: Socket) {
      const userId = client.handshake.query.userId as string;
      this.userSockets.set(userId, client.id);
    }
  
    handleDisconnect(client: Socket) {
      const userId = Array.from(this.userSockets.entries())
        .find(([_, socketId]) => socketId === client.id)?.[0];
      if (userId) {
        this.userSockets.delete(userId);
      }
    }
  
    @SubscribeMessage('joinGroup')
    handleJoinGroup(client: Socket, groupId: string) {
      client.join(`group-${groupId}`);
    }
  
    @SubscribeMessage('leaveGroup')
    handleLeaveGroup(client: Socket, groupId: string) {
      client.leave(`group-${groupId}`);
    }
  
    notifyGroupMembers(groupId: Types.ObjectId, event: string, data: any) {
      this.server.to(`group-${groupId}`).emit(event, data);
    }
  }