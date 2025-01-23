import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message } from './message.schema';
import { CreateMessageDto } from './dto/message.dto';
import { WebSocketGateway } from '../gateways/websocket.gateway';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private readonly wsGateway: WebSocketGateway,
  ) {}

  // async create(createMessageDto: CreateMessageDto, userId: Types.ObjectId): Promise<Message> {
  //   const message = new this.messageModel({
  //     ...createMessageDto,
  //     sender: userId,
  //   });
  //   const savedMessage = await message.save();
    
  //   // Notify group members about new message
  //   this.wsGateway.notifyGroupMembers(createMessageDto.group, 'newMessage', savedMessage);
    
  //   return savedMessage;
  // }

  // async create(createMessageDto: CreateMessageDto, userId: string): Promise<Message> {
  //   const message = new this.messageModel({
  //     ...createMessageDto,
  //     sender: userId,
  //   });

  //   const savedMessage = await message.save();

  //   // Notify group members of the new message
  //   this.wsGateway.notifyGroupMembers(createMessageDto.group, 'newMessage', savedMessage);

  //   return savedMessage;
  // }

  // async create(createMessageDto: CreateMessageDto, userId: string): Promise<Message> {
  //   const message = new this.messageModel({
  //     ...createMessageDto,
  //     sender: new Types.ObjectId(userId), // Convert sender to ObjectId
  //     group: new Types.ObjectId(createMessageDto.group), // Convert group to ObjectId
  //   });
  
  //   console.log('Creating message:', message); // Debug log

  //   const savedMessage = await message.save();
  
  //   // Notify group members of the new message
  //   this.wsGateway.notifyGroupMembers(message.group, 'newMessage', savedMessage);
  
  //   return savedMessage;
  // }

  async create(createMessageDto: CreateMessageDto, userId: string): Promise<Message> {
    const { content, group, attachments = [], type = 'text' } = createMessageDto;
  
    const groupId = new Types.ObjectId(group); // Convert group to ObjectId
    const senderId = new Types.ObjectId(userId); // Convert userId to ObjectId
  
    const message = new this.messageModel({
      content,
      group: groupId,
      sender: senderId,
      attachments,
      type,
    });
  
    const savedMessage = await message.save();
  
    // Notify group members of the new message∏
    this.wsGateway.notifyGroupMembers(groupId, 'newMessage', savedMessage);
  
    return savedMessage;
  }
  

  // async findGroupMessages(groupId: string): Promise<Message[]> {
  //   return this.messageModel
  //     .find({ group: groupId })
  //     .populate('sender', 'username')
  //     .sort({ createdAt: 1 });
  // }
  async findGroupMessages(groupId: string): Promise<Message[]> {
    return this.messageModel
      .find({ group: new Types.ObjectId(groupId) }) // Ensure groupId is converted to ObjectId
      .populate('sender', 'username')
      .sort({ createdAt: 1 });
  }

  async getUnreadMessages(groupId: string, userId: string): Promise<Message[]> {
    return this.messageModel
      .find({
        group: new Types.ObjectId(groupId), // Ensure the groupId is an ObjectId
        'readBy.user': { $ne: new Types.ObjectId(userId) }, // Exclude messages read by the user
      })
      .populate('sender', 'username') // Optionally populate sender details
      .sort({ createdAt: 1 }); // Sort by creation time
  }

  async markMessagesAsRead(groupId: string, userId: string): Promise<void> {
    await this.messageModel.updateMany(
      {
        group: new Types.ObjectId(groupId),
        'readBy.user': { $ne: new Types.ObjectId(userId) }, // Only update unread messages
      },
      {
        $push: { readBy: { user: new Types.ObjectId(userId), readAt: new Date() } },
      }
    );
  }
}