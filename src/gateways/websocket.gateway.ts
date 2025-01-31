import {
  WebSocketGateway as WsGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayInit,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { forwardRef, Inject, UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../auth/ws-jwt.guard';
import { Types } from 'mongoose';
import { GroupsService } from 'src/group/group.service';
import { MessagesService } from 'src/message/message.service';

@WsGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class WebSocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  logger = new Logger('WebSocketGateway');

  public notifyGroupMembers(groupId: Types.ObjectId, event: string, data: any) {
    console.log(`Notifying group members in room group-${groupId}kkkkkkkkkkk: Event: ${event} data: ${data}`);
    this.server.to(`group-${groupId.toString()}`).emit(event, data);
  }

  constructor(
    // @Inject(forwardRef(() => GroupsService))
    // @Inject(forwardRef(() => MessagesService))
    // private readonly groupsService: GroupsService,
    // private readonly messagesService: MessagesService,
    @Inject(forwardRef(() => GroupsService)) private readonly groupsService: GroupsService,
    @Inject(forwardRef(() => MessagesService)) private readonly messagesService: MessagesService,
  ) {}

  afterInit(server: Server) {
    console.log('Init');
  }

  private userSockets: Map<string, string> = new Map();

  @UseGuards(WsJwtGuard)
  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.userSockets.set(userId, client.id);
      this.logger.log(`User ${userId} connected with socket ID: ${client.id}`);
      this.fetchAndJoinGroups(userId, client);
    }
  }

  async fetchAndJoinGroups(userId: string, client: Socket) {
    try {
      const groups = await this.groupsService.findUserGroups(userId);
      this.logger.log(`User ${userId} belongs to groups: ${JSON.stringify(groups)}`);

      groups.forEach((group) => {
        this.handleJoinGroup(client, group.id);
      });
    } catch (error) {
      this.logger.error(`Failed to fetch and join groups for user ${userId}`, error.stack);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = Array.from(this.userSockets.entries()).find(
      ([_, socketId]) => socketId === client.id,
    )?.[0];
    if (userId) {
      this.userSockets.delete(userId);
      this.logger.log(`User ${userId} disconnected`);
    }
  }

  @SubscribeMessage('joinGroup')
  handleJoinGroup(client: Socket, groupId: string) {
    this.logger.log(`Received joinGroup event from client ${client.id} for group ${groupId}`);

    if (!Types.ObjectId.isValid(groupId)) {
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

// @SubscribeMessage('message.new')
// async handleNewMessage(client: Socket, payload: any) {
//   this.logger.log(`Received payload:`, payload);

//   // Check each required field individually
//   const missingFields = [];
//   if (!payload.groupId) missingFields.push('groupId');
//   if (!payload.content) missingFields.push('content');
//   if (!payload.senderId) missingFields.push('senderId');

//   if (missingFields.length > 0) {
//     const errorMsg = `Missing required fields: ${missingFields.join(', ')}`;
//     this.logger.warn(errorMsg);
//     client.emit('error', { error: errorMsg });
//     return;
//   }

//   const { groupId, content, senderId, type = 'text' } = payload;

//   if (!Types.ObjectId.isValid(groupId) || !Types.ObjectId.isValid(senderId)) {
//     const errorMsg = 'Invalid groupId or senderId format';
//     this.logger.warn(errorMsg);
//     client.emit('error', { error: errorMsg });
//     return;
//   }

//   try {
//     const messageData = {
//       group: groupId,
//       content,
//       sender: senderId,
//       type,
//     };

//     this.logger.log(`Creating new message:`, messageData);
//     const chat = await this.messagesService.create(messageData, senderId);
    
//     this.server.to(groupId).emit('receive-message', chat);
//     client.emit('message-sent', { success: true, messageId: chat._id });
//   } catch (error) {
//     this.logger.error('Error creating message:', error);
//     client.emit('error', { error: 'Failed to create message', details: error.message });
//   }
// }

// @SubscribeMessage('message.new')
// async handleNewMessage(client: Socket, payload: any) {
//   this.logger.log(`Received payload:`, payload);

//   // Check for required fields
//   if (!payload.groupId || !payload.content || !payload.senderId) {
//     const errorMsg = 'Missing required fields';
//     this.logger.warn(errorMsg);
//     client.emit('error', { error: errorMsg });
//     return;
//   }

//   const { groupId, content, senderId, type = 'text' } = payload;

//   // Validate ObjectId format
//   if (!Types.ObjectId.isValid(groupId) || !Types.ObjectId.isValid(senderId)) {
//     const errorMsg = 'Invalid groupId or senderId format';
//     this.logger.warn(errorMsg);
//     client.emit('error', { error: errorMsg });
//     return;
//   }

//   try {
//     // Store the message as received without formatting
//     const messageData = {
//       group: groupId,
//       content,
//       sender: senderId,
//       type,
//     };

//     this.logger.log(`Creating new message:`, messageData);
//     const chat = await this.messagesService.create(messageData, senderId);

//     // Emit the message as received (NO FORMATTING)
//     this.server.to(groupId).emit('receive-message', payload);
//     client.emit('message-sent', { success: true, messageId: chat._id });
//   } catch (error) {
//     this.logger.error('Error creating message:', error);
//     client.emit('error', { error: 'Failed to create message', details: error.message });
//   }
// }

@SubscribeMessage('message.new')
async handleNewMessage(client: Socket, payload: any) {
  this.logger.log('Received payload:', payload);

  // Check for required fields
  if (!payload.groupId || !payload.content || !payload.senderId) {
    const errorMsg = 'Missing required fields';
    this.logger.warn(errorMsg);
    client.emit('error', { error: errorMsg });
    return;
  }

  // Validate ObjectId format
  if (!Types.ObjectId.isValid(payload.groupId) || !Types.ObjectId.isValid(payload.senderId)) {
    const errorMsg = 'Invalid groupId or senderId format';
    this.logger.warn(errorMsg);
    client.emit('error', { error: errorMsg });
    return;
  }

  try {
    // Store the message as received without formatting
    this.logger.log('Creating new message:', payload);
    const chat = await this.messagesService.create(payload, payload.senderId);

    // Emit the message as received (NO FORMATTING)
    this.server.to(payload.groupId).emit('receive-message', payload);
    client.emit('message-sent', { success: true, messageId: chat._id, payload });
  } catch (error) {
    this.logger.error('Error creating message:', error);
    client.emit('error', { error: 'Failed to create message', details: error.message });
  }
}


}