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

  async create(createMessageDto: CreateMessageDto, userId: string): Promise<Message> {
    const message = new this.messageModel({
      ...createMessageDto,
      sender: new Types.ObjectId(userId), // Convert sender to ObjectId
      group: new Types.ObjectId(createMessageDto.group), // Convert group to ObjectId
    });
  
    console.log('Creating message:', message); // Debug log

    const savedMessage = await message.save();
  
    // Notify group members of the new message
    this.wsGateway.notifyGroupMembers(message.group, 'newMessage', savedMessage);
  
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
}