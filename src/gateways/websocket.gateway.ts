// import {
//     WebSocketGateway as WsGateway,
//     WebSocketServer,
//     SubscribeMessage,
//     OnGatewayConnection,
//     OnGatewayDisconnect,
//   } from '@nestjs/websockets';
//   import { Server, Socket } from 'socket.io';
//   import { UseGuards } from '@nestjs/common';
//   import { WsJwtGuard } from '../auth/ws-jwt.guard';
//   import { Types } from 'mongoose';
  
//   @WsGateway({
//     cors: {
//       origin: '*',
//     },
//   })
//   export class WebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
//     @WebSocketServer()
//     server: Server;
  
//     private userSockets: Map<string, string> = new Map();
  
//     @UseGuards(WsJwtGuard)
//     async handleConnection(client: Socket) {
//       const userId = client.handshake.query.userId as string;
//       this.userSockets.set(userId, client.id);
//     }
  
//     handleDisconnect(client: Socket) {
//       const userId = Array.from(this.userSockets.entries())
//         .find(([_, socketId]) => socketId === client.id)?.[0];
//       if (userId) {
//         this.userSockets.delete(userId);
//       }
//     }
  
//     @SubscribeMessage('joinGroup')
//     handleJoinGroup(client: Socket, groupId: string) {
//       client.join(`group-${groupId}`);
//     }
  
//     @SubscribeMessage('leaveGroup')
//     handleLeaveGroup(client: Socket, groupId: string) {
//       client.leave(`group-${groupId}`);
//     }
  
//     notifyGroupMembers(groupId: Types.ObjectId, event: string, data: any) {
//       this.server.to(`group-${groupId}`).emit(event, data);
//     }
//   }

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
    if (userId) {
      this.userSockets.set(userId, client.id);
      console.log(`User ${userId} connected`);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = Array.from(this.userSockets.entries())
      .find(([_, socketId]) => socketId === client.id)?.[0];
    if (userId) {
      this.userSockets.delete(userId);
      console.log(`User ${userId} disconnected`);
    }
  }

  @SubscribeMessage('joinGroup')
  handleJoinGroup(client: Socket, groupId: string) {
    console.log(`User joined group: ${groupId}`);
    client.join(`group-${groupId}`);
    this.server.to(`group-${groupId}`).emit('group.update', {
      message: `A user has joined the group: ${groupId}`,
    });
  }

  @SubscribeMessage('leaveGroup')
  handleLeaveGroup(client: Socket, groupId: string) {
    console.log(`User left group: ${groupId}`);
    client.leave(`group-${groupId}`);
    this.server.to(`group-${groupId}`).emit('group.update', {
      message: `A user has left the group: ${groupId}`,
    });
  }

  @SubscribeMessage('message.new')
  handleNewMessage(client: Socket, payload: any) {
    const { groupId, content, senderId, type = 'text' } = payload;

    if (!groupId || !content || !senderId) {
      console.error('Invalid message payload', payload);
      return;
    }

    const message = {
      id: new Types.ObjectId().toString(), // Generate a unique message ID
      groupId,
      content,
      senderId,
      type,
      timestamp: new Date().toISOString(),
    };

    console.log('New message:', message);

    // Emit the message to the group
    this.server.to(`group-${groupId}`).emit('message.new', { message });
  }

  @SubscribeMessage('messages.fetch')
  handleFetchMessages(client: Socket, payload: any) {
    const { groupId } = payload;

    if (!groupId) {
      console.error('Invalid groupId in messages.fetch payload', payload);
      return;
    }

    // Simulate fetching messages from a database or service
    const messages = [
      {
        id: new Types.ObjectId().toString(),
        groupId,
        content: 'Welcome to the group chat!',
        senderId: 'system',
        type: 'text',
        timestamp: new Date().toISOString(),
      },
    ];

    console.log(`Messages fetched for group ${groupId}:`, messages);

    // Send the fetched messages back to the client
    client.emit('messages.update', messages);
  }

  notifyGroupMembers(groupId: Types.ObjectId, event: string, data: any) {
    this.server.to(`group-${groupId}`).emit(event, data);
  }
}
