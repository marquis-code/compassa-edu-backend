// import { Injectable, Logger } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model, Types } from 'mongoose';
// import { Message } from './message.schema';
// import { CreateMessageDto } from './dto/message.dto';
// import { WebSocketGateway } from '../gateways/websocket.gateway';

// @Injectable()
// export class MessagesService {
//   constructor(
//     @InjectModel(Message.name) private messageModel: Model<Message>,
//     private readonly wsGateway: WebSocketGateway,
//   ) {}

//   // async create(createMessageDto: CreateMessageDto, userId: Types.ObjectId): Promise<Message> {
//   //   const message = new this.messageModel({
//   //     ...createMessageDto,
//   //     sender: userId,
//   //   });
//   //   const savedMessage = await message.save();
    
//   //   // Notify group members about new message
//   //   this.wsGateway.notifyGroupMembers(createMessageDto.group, 'newMessage', savedMessage);
    
//   //   return savedMessage;
//   // }

//   // async create(createMessageDto: CreateMessageDto, userId: string): Promise<Message> {
//   //   const message = new this.messageModel({
//   //     ...createMessageDto,
//   //     sender: userId,
//   //   });

//   //   const savedMessage = await message.save();

//   //   // Notify group members of the new message
//   //   this.wsGateway.notifyGroupMembers(createMessageDto.group, 'newMessage', savedMessage);

//   //   return savedMessage;
//   // }

//   // async create(createMessageDto: CreateMessageDto, userId: string): Promise<Message> {
//   //   const message = new this.messageModel({
//   //     ...createMessageDto,
//   //     sender: new Types.ObjectId(userId), // Convert sender to ObjectId
//   //     group: new Types.ObjectId(createMessageDto.group), // Convert group to ObjectId
//   //   });
  
//   //   console.log('Creating message:', message); // Debug log

//   //   const savedMessage = await message.save();
  
//   //   // Notify group members of the new message
//   //   this.wsGateway.notifyGroupMembers(message.group, 'newMessage', savedMessage);
  
//   //   return savedMessage;
//   // }

//   async create(createMessageDto: CreateMessageDto, userId: string): Promise<Message> {
//     const { content, group, attachments = [], type = 'text' } = createMessageDto;
  
//     const groupId = new Types.ObjectId(group); // Convert group to ObjectId
//     const senderId = new Types.ObjectId(userId); // Convert userId to ObjectId
  
//     const message = new this.messageModel({
//       content,
//       group: groupId,
//       sender: senderId,
//       attachments,
//       type,
//     });
  
//     const savedMessage = await message.save();
//     console.log(savedMessage, 'saved message here')
  
//     // Notify group members of the new message∏
//     this.wsGateway.notifyGroupMembers(groupId, 'message.new', savedMessage);
  
//     return savedMessage;
//   }
  

//   // async findGroupMessages(groupId: string): Promise<Message[]> {
//   //   return this.messageModel
//   //     .find({ group: groupId })
//   //     .populate('sender', 'username')
//   //     .sort({ createdAt: 1 });
//   // }
//   async findGroupMessages(groupId: string): Promise<Message[]> {
//     return this.messageModel
//       .find({ group: new Types.ObjectId(groupId) }) // Ensure groupId is converted to ObjectId
//       .populate('sender', 'username')
//       .sort({ createdAt: 1 });
//   }

//   async getUnreadMessages(groupId: string, userId: string): Promise<Message[]> {
//     return this.messageModel
//       .find({
//         group: new Types.ObjectId(groupId), // Ensure the groupId is an ObjectId
//         'readBy.user': { $ne: new Types.ObjectId(userId) }, // Exclude messages read by the user
//       })
//       .populate('sender', 'username') // Optionally populate sender details
//       .sort({ createdAt: 1 }); // Sort by creation time
//   }

//   async markMessagesAsRead(groupId: string, userId: string): Promise<void> {
//     await this.messageModel.updateMany(
//       {
//         group: new Types.ObjectId(groupId),
//         'readBy.user': { $ne: new Types.ObjectId(userId) }, // Only update unread messages
//       },
//       {
//         $push: { readBy: { user: new Types.ObjectId(userId), readAt: new Date() } },
//       }
//     );
//   }
// }

import { Injectable, Logger, forwardRef, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message } from './message.schema';
import { CreateMessageDto } from './dto/message.dto';
import { WebSocketGateway } from '../gateways/websocket.gateway';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);

  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @Inject(forwardRef(() => WebSocketGateway))
    private readonly wsGateway: WebSocketGateway,
  ) {}

  // async create(createMessageDto: CreateMessageDto, userId: string): Promise<Message> {
  //   this.logger.log('Starting to create a message');
  //   const { content, group, attachments = [], type = 'text' } = createMessageDto;

  //   const groupId = new Types.ObjectId(group); // Convert group to ObjectId
  //   const senderId = new Types.ObjectId(userId); // Convert userId to ObjectId

  //   this.logger.debug(`Creating message for group: ${groupId} by user: ${senderId}`);

  //   const message = new this.messageModel({
  //     content,
  //     group: groupId,
  //     sender: senderId,
  //     attachments,
  //     type,
  //   });

  //   const savedMessage = await message.save();
  //   // this.logger.log('Message saved successfully');
  //   this.logger.debug(`Saved Message: ${JSON.stringify(savedMessage)}`);

  //   // Notify group members of the new message
  //   // this.logger.log(`Notifying group members about new message in group: ${groupId}`);
  //   this.wsGateway.notifyGroupMembers(groupId, 'message.new', savedMessage);

  //   return savedMessage;
  // }

  async create(createMessageDto: CreateMessageDto, userId: string): Promise<Message> {
    this.logger.log('Starting to create a message');
    const { content, group, attachments = [], type = 'text' } = createMessageDto;
  
    const groupId = new Types.ObjectId(group); // Convert group to ObjectId
    const senderId = new Types.ObjectId(userId); // Convert userId to ObjectId
  
    this.logger.debug(`Creating message for group: ${groupId} by user: ${senderId}`);
  
    const message = new this.messageModel({
      content,
      group: groupId,
      sender: senderId,
      attachments,
      type,
    });
  
    // Save the message and return
    const savedMessage = await message.save();
    this.logger.debug(`Saved Message: ${JSON.stringify(savedMessage)}`);
  
    // Notify group members of the new message
    console.log(savedMessage, 'saved hesssss here')
    this.wsGateway.notifyGroupMembers(groupId, 'message.new', savedMessage);
  
    return savedMessage;
  }
  

  async findGroupMessages(groupId: string): Promise<Message[]> {
    // this.logger.log(`Fetching messages for group: ${groupId}`);
    const messages = await this.messageModel
      .find({ group: new Types.ObjectId(groupId) }) // Ensure groupId is converted to ObjectId
      .populate('sender', 'username')
      .sort({ createdAt: 1 });

    // this.logger.log(`Found ${messages.length} messages for group: ${groupId}`);
    // this.logger.debug(`Messages: ${JSON.stringify(messages)}`);

    return messages;
  }

  async getUnreadMessages(groupId: string, userId: string): Promise<Message[]> {
    // this.logger.log(`Fetching unread messages for group: ${groupId} and user: ${userId}`);
    const unreadMessages = await this.messageModel
      .find({
        group: new Types.ObjectId(groupId), // Ensure the groupId is an ObjectId
        'readBy.user': { $ne: new Types.ObjectId(userId) }, // Exclude messages read by the user
      })
      .populate('sender', 'username') // Optionally populate sender details
      .sort({ createdAt: 1 }); // Sort by creation time

    // this.logger.log(`Found ${unreadMessages.length} unread messages for user: ${userId}`);
    // this.logger.debug(`Unread Messages: ${JSON.stringify(unreadMessages)}`);

    return unreadMessages;
  }

  async markMessagesAsRead(groupId: string, userId: string): Promise<void> {
    this.logger.log(`Marking messages3 as read for group: ${groupId} and user: ${userId}`);
    const result = await this.messageModel.updateMany(
      {
        group: new Types.ObjectId(groupId),
        'readBy.user': { $ne: new Types.ObjectId(userId) }, // Only update unread messages
      },
      {
        $push: { readBy: { user: new Types.ObjectId(userId), readAt: new Date() } },
      }
    );

    this.logger.log(`Marked messages as read for user: ${userId}`);
    this.logger.debug(`Update result: ${JSON.stringify(result)}`);
  }
}
