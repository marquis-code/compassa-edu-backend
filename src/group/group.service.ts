import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Group } from './group.schema';
import { CreateGroupDto, UpdateGroupDto } from './dto/group.dto';
import { WebSocketGateway } from '../gateways/websocket.gateway';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<Group>,
    private readonly wsGateway: WebSocketGateway,
  ) {}

  async create(createGroupDto: CreateGroupDto, userId: Types.ObjectId): Promise<Group> {
    const group = new this.groupModel({
      ...createGroupDto,
      creator: userId,
      members: [userId],
    });
    return group.save();
  }

  async findAll(status?: 'public' | 'private'): Promise<Group[]> {
    const query = status ? { status } : {};
    return this.groupModel.find(query).populate('members', 'username email');
  }

  async findOne(id: string): Promise<Group> {
    const group = await this.groupModel.findById(id).populate('members', 'username email');
    if (!group) throw new NotFoundException('Group not found');
    return group;
  }

  async update(id: string, updateGroupDto: UpdateGroupDto, userId: Types.ObjectId): Promise<Group> {
    const group = await this.findOne(id);
    if (group.creator.toString() !== userId.toString()) {
      throw new ForbiddenException('Only group creator can update group');
    }
    return this.groupModel.findByIdAndUpdate(id, updateGroupDto, { new: true });
  }

  async delete(id: string, userId: Types.ObjectId): Promise<void> {
    const group = await this.findOne(id);
    if (group.creator.toString() !== userId.toString()) {
      throw new ForbiddenException('Only group creator can delete group');
    }
    await this.groupModel.findByIdAndDelete(id);
  }

  async joinGroup(groupId: string, userId: Types.ObjectId): Promise<Group> {
    const group = await this.findOne(groupId);
    if (group.status === 'private') {
      throw new ForbiddenException('Cannot join private group without invitation');
    }
    if (!group.members.includes(userId)) {
      group.members.push(userId);
      await group.save();
    }
    return group;
  }

  async leaveGroup(groupId: string, userId: Types.ObjectId): Promise<void> {
    const group = await this.findOne(groupId);
    if (group.creator.toString() === userId.toString()) {
      throw new ForbiddenException('Group creator cannot leave the group');
    }
    group.members = group.members.filter(member => member.toString() !== userId.toString());
    await group.save();
  }

  // async joinByUserId(groupId: string, userId: string): Promise<Group> {
  //   const group = await this.groupModel.findById(groupId);
  
  //   if (!group) {
  //     throw new NotFoundException('Group not found');
  //   }
  
  //   const userObjectId = new Types.ObjectId(userId); // Convert userId to ObjectId
  
  //   // Check if the user is already a member
  //   if (!group.members.some(member => member.equals(userObjectId))) {
  //     group.members.push(userObjectId);
  //     await group.save();
  //   }
  
  //   return group;
  // }
  async joinByUserId(groupId: string, userId: string): Promise<Group> {
    const group = await this.groupModel.findById(groupId);
  
    if (!group) {
      throw new NotFoundException('Group not found');
    }
  
    const userObjectId = new Types.ObjectId(userId); // Convert userId to ObjectId
  
    // Check if the user is already a member
    if (!group.members.some(member => new Types.ObjectId(member).equals(userObjectId))) {
      group.members.push(userObjectId);
      await group.save();
    }
  
    return group;
  }
}