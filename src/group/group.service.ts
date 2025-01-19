// // // // import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
// // // // import { InjectModel } from '@nestjs/mongoose';
// // // // import { Model, Types } from 'mongoose';
// // // // import { Group } from './group.schema';
// // // // import { CreateGroupDto, UpdateGroupDto } from './dto/group.dto';
// // // // import { MessagePopulated } from '../message/message.schema';
// // // // import { WebSocketGateway } from '../gateways/websocket.gateway';

// // // // @Injectable()
// // // // export class GroupsService {
// // // //   constructor(
// // // //     @InjectModel(Group.name) private groupModel: Model<Group>,
// // // //     private readonly wsGateway: WebSocketGateway,
// // // //   ) {}

// // // //   async create(createGroupDto: CreateGroupDto, userId: Types.ObjectId): Promise<Group> {
// // // //     const group = new this.groupModel({
// // // //       ...createGroupDto,
// // // //       creator: userId,
// // // //       members: [userId],
// // // //     });
// // // //     return group.save();
// // // //   }

// // // //   async findAll(status?: 'public' | 'private'): Promise<Group[]> {
// // // //     const query = status ? { status } : {};
// // // //     return this.groupModel.find(query).populate('members', 'username email');
// // // //   }

// // // //   async findOne(id: string): Promise<Group> {
// // // //     const group = await this.groupModel.findById(id).populate('members', 'username email');
// // // //     if (!group) throw new NotFoundException('Group not found');
// // // //     return group;
// // // //   }

// // // //   async update(id: string, updateGroupDto: UpdateGroupDto, userId: Types.ObjectId): Promise<Group> {
// // // //     const group = await this.findOne(id);
// // // //     if (group.creator.toString() !== userId.toString()) {
// // // //       throw new ForbiddenException('Only group creator can update group');
// // // //     }
// // // //     return this.groupModel.findByIdAndUpdate(id, updateGroupDto, { new: true });
// // // //   }

// // // //   async delete(id: string, userId: Types.ObjectId): Promise<void> {
// // // //     const group = await this.findOne(id);
// // // //     if (group.creator.toString() !== userId.toString()) {
// // // //       throw new ForbiddenException('Only group creator can delete group');
// // // //     }
// // // //     await this.groupModel.findByIdAndDelete(id);
// // // //   }

// // // //   async joinGroup(groupId: string, userId: Types.ObjectId): Promise<Group> {
// // // //     const group = await this.findOne(groupId);
// // // //     if (group.status === 'private') {
// // // //       throw new ForbiddenException('Cannot join private group without invitation');
// // // //     }
// // // //     if (!group.members.includes(userId)) {
// // // //       group.members.push(userId);
// // // //       await group.save();
// // // //     }
// // // //     return group;
// // // //   }

// // // //   async leaveGroup(groupId: string, userId: Types.ObjectId): Promise<void> {
// // // //     const group = await this.findOne(groupId);
// // // //     if (group.creator.toString() === userId.toString()) {
// // // //       throw new ForbiddenException('Group creator cannot leave the group');
// // // //     }
// // // //     group.members = group.members.filter(member => member.toString() !== userId.toString());
// // // //     await group.save();
// // // //   }

// // // //   // async joinByUserId(groupId: string, userId: string): Promise<Group> {
// // // //   //   const group = await this.groupModel.findById(groupId);
  
// // // //   //   if (!group) {
// // // //   //     throw new NotFoundException('Group not found');
// // // //   //   }
  
// // // //   //   const userObjectId = new Types.ObjectId(userId); // Convert userId to ObjectId
  
// // // //   //   // Check if the user is already a member
// // // //   //   if (!group.members.some(member => member.equals(userObjectId))) {
// // // //   //     group.members.push(userObjectId);
// // // //   //     await group.save();
// // // //   //   }
  
// // // //   //   return group;
// // // //   // }
// // // //   async joinByUserId(groupId: string, userId: string): Promise<Group> {
// // // //     const group = await this.groupModel.findById(groupId);
  
// // // //     if (!group) {
// // // //       throw new NotFoundException('Group not found');
// // // //     }
  
// // // //     const userObjectId = new Types.ObjectId(userId); // Convert userId to ObjectId
  
// // // //     // Check if the user is already a member
// // // //     if (!group.members.some(member => new Types.ObjectId(member).equals(userObjectId))) {
// // // //       group.members.push(userObjectId);
// // // //       await group.save();
// // // //     }
  
// // // //     return group;
// // // //   }

// // // //   // async getUserGroupsWithMessages(userId: Types.ObjectId): Promise<any[]> {
// // // //   //   const groups = await this.groupModel
// // // //   //     .find({ members: userId })
// // // //   //     .populate('members', 'username email')
// // // //   //     .populate({
// // // //   //       path: 'messages',
// // // //   //       populate: [
// // // //   //         {
// // // //   //           path: 'sender',
// // // //   //           select: 'username email',
// // // //   //         },
// // // //   //         {
// // // //   //           path: 'readBy.user',
// // // //   //           select: 'username email',
// // // //   //         },
// // // //   //       ],
// // // //   //     })
// // // //   //     .exec();
  
// // // //   //   if (!groups || groups.length === 0) {
// // // //   //     throw new NotFoundException('No groups found for the user');
// // // //   //   }
  
// // // //   //   return groups.map(group => ({
// // // //   //     id: group._id,
// // // //   //     name: group.name,
// // // //   //     description: group.description,
// // // //   //     members: group.members,
// // // //   //     messages: (group.messages as MessagePopulated[]).map(message => ({
// // // //   //       id: message._id,
// // // //   //       content: message.content,
// // // //   //       type: message.type,
// // // //   //       sender: message.sender,
// // // //   //       attachments: message.attachments,
// // // //   //       readBy: message.readBy,
// // // //   //       createdAt: message.createdAt,
// // // //   //       updatedAt: message.updatedAt,
// // // //   //     })),
// // // //   //   }));
// // // //   // }
  
// // // //   // async getUserGroupsWithMessages(userId: Types.ObjectId): Promise<any[]> {
// // // //   //   const groups = await this.groupModel
// // // //   //     .find({ members: userId })
// // // //   //     .populate('members', 'username email') // Populate group members
// // // //   //     .populate({
// // // //   //       path: 'messages',
// // // //   //       model: 'Message', // Ensure Mongoose knows which model to use for messages
// // // //   //       populate: [
// // // //   //         {
// // // //   //           path: 'sender',
// // // //   //           model: 'User', // Ensure Mongoose knows which model to use for sender
// // // //   //           select: 'username email',
// // // //   //         },
// // // //   //         {
// // // //   //           path: 'readBy.user',
// // // //   //           model: 'User', // Ensure Mongoose knows which model to use for readBy.user
// // // //   //           select: 'username email',
// // // //   //         },
// // // //   //       ],
// // // //   //     })
// // // //   //     .exec();
  
// // // //   //   if (!groups || groups.length === 0) {
// // // //   //     throw new NotFoundException('No groups found for the user');
// // // //   //   }
  
// // // //   //   // Explicitly type the messages as `MessagePopulated[]`
// // // //   //   return groups.map(group => ({
// // // //   //     id: group._id,
// // // //   //     name: group.name,
// // // //   //     description: group.description,
// // // //   //     members: group.members,
// // // //   //     messages: (group.messages as unknown as MessagePopulated[]).map(message => ({
// // // //   //       id: message._id,
// // // //   //       content: message.content,
// // // //   //       type: message.type,
// // // //   //       sender: message.sender,
// // // //   //       attachments: message.attachments,
// // // //   //       readBy: message.readBy,
// // // //   //       createdAt: message.createdAt,
// // // //   //       updatedAt: message.updatedAt,
// // // //   //     })),
// // // //   //   }));
// // // //   // }
  
// // // //   async getUserGroupsWithMessages(userId: string): Promise<any[]> {
// // // //     // Validate and convert `userId` to ObjectId
// // // //     if (!Types.ObjectId.isValid(userId)) {
// // // //       throw new NotFoundException(`Invalid user ID: ${userId}`);
// // // //     }
// // // //     const userObjectId = new Types.ObjectId(userId);

// // // //     // Query for groups where the user is a member
// // // //     const groups = await this.groupModel
// // // //       .find({ members: userObjectId })
// // // //       .populate('members', 'username email') // Populate group members
// // // //       .populate({
// // // //         path: 'messages',
// // // //         model: 'Message', // Ensure Mongoose knows which model to use for messages
// // // //         populate: [
// // // //           {
// // // //             path: 'sender',
// // // //             model: 'User', // Ensure Mongoose knows which model to use for sender
// // // //             select: 'username email',
// // // //           },
// // // //           {
// // // //             path: 'readBy.user',
// // // //             model: 'User', // Ensure Mongoose knows which model to use for readBy.user
// // // //             select: 'username email',
// // // //           },
// // // //         ],
// // // //       })
// // // //       .exec();

// // // //     if (!groups || groups.length === 0) {
// // // //       throw new NotFoundException('No groups found for the user');
// // // //     }

// // // //     // Map and format the response
// // // //     return groups.map((group) => ({
// // // //       id: group._id,
// // // //       name: group.name,
// // // //       description: group.description,
// // // //       members: group.members,
// // // //       messages: group.messages.map((message) => ({
// // // //         id: message._id,
// // // //         content: message.content,
// // // //         type: message.type,
// // // //         sender: message.sender,
// // // //         attachments: message.attachments,
// // // //         readBy: message.readBy,
// // // //         createdAt: message.createdAt,
// // // //         updatedAt: message.updatedAt,
// // // //       })),
// // // //     }));
// // // //   }
// // // // }

// // // import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
// // // import { InjectModel } from '@nestjs/mongoose';
// // // import { Model, Types } from 'mongoose';
// // // import { Group } from './group.schema';
// // // import { CreateGroupDto, UpdateGroupDto } from './dto/group.dto';
// // // import { MessagePopulated } from '../message/message.schema';
// // // import { WebSocketGateway } from '../gateways/websocket.gateway';

// // // @Injectable()
// // // export class GroupsService {
// // //   constructor(
// // //     @InjectModel('Group') private groupModel: Model<Group>, // Use the string 'Group' here
// // //     private readonly wsGateway: WebSocketGateway,
// // //   ) {}

// // //   async create(createGroupDto: CreateGroupDto, userId: Types.ObjectId): Promise<Group> {
// // //     const group = new this.groupModel({
// // //       ...createGroupDto,
// // //       creator: userId,
// // //       members: [userId],
// // //     });
// // //     return group.save();
// // //   }

// // //   async findAll(status?: 'public' | 'private'): Promise<Group[]> {
// // //     const query = status ? { status } : {};
// // //     return this.groupModel.find(query).populate('members', 'username email');
// // //   }

// // //   async findOne(id: string): Promise<Group> {
// // //     const group = await this.groupModel.findById(id).populate('members', 'username email');
// // //     if (!group) throw new NotFoundException('Group not found');
// // //     return group;
// // //   }

// // //   async update(id: string, updateGroupDto: UpdateGroupDto, userId: Types.ObjectId): Promise<Group> {
// // //     const group = await this.findOne(id);
// // //     if (group.creator.toString() !== userId.toString()) {
// // //       throw new ForbiddenException('Only group creator can update group');
// // //     }
// // //     return this.groupModel.findByIdAndUpdate(id, updateGroupDto, { new: true });
// // //   }

// // //   async delete(id: string, userId: Types.ObjectId): Promise<void> {
// // //     const group = await this.findOne(id);
// // //     if (group.creator.toString() !== userId.toString()) {
// // //       throw new ForbiddenException('Only group creator can delete group');
// // //     }
// // //     await this.groupModel.findByIdAndDelete(id);
// // //   }

// // //   async joinGroup(groupId: string, userId: Types.ObjectId): Promise<Group> {
// // //     const group = await this.findOne(groupId);
// // //     if (group.status === 'private') {
// // //       throw new ForbiddenException('Cannot join private group without invitation');
// // //     }
// // //     if (!group.members.includes(userId)) {
// // //       group.members.push(userId);
// // //       await group.save();
// // //     }
// // //     return group;
// // //   }

// // //   async leaveGroup(groupId: string, userId: Types.ObjectId): Promise<void> {
// // //     const group = await this.findOne(groupId);
// // //     if (group.creator.toString() === userId.toString()) {
// // //       throw new ForbiddenException('Group creator cannot leave the group');
// // //     }
// // //     group.members = group.members.filter((member) => member.toString() !== userId.toString());
// // //     await group.save();
// // //   }

// // //   async joinByUserId(groupId: string, userId: string): Promise<Group> {
// // //     const group = await this.groupModel.findById(groupId);

// // //     if (!group) {
// // //       throw new NotFoundException('Group not found');
// // //     }

// // //     const userObjectId = new Types.ObjectId(userId); // Convert userId to ObjectId

// // //     // Check if the user is already a member
// // //     if (!group.members.some((member) => new Types.ObjectId(member).equals(userObjectId))) {
// // //       group.members.push(userObjectId);
// // //       await group.save();
// // //     }

// // //     return group;
// // //   }

// // //   async getUserGroupsWithMessages(userId: string): Promise<any[]> {
// // //     // Validate and convert `userId` to ObjectId
// // //     if (!Types.ObjectId.isValid(userId)) {
// // //       throw new NotFoundException(`Invalid user ID: ${userId}`);
// // //     }
// // //     const userObjectId = new Types.ObjectId(userId);

// // //     // Query for groups where the user is a member
// // //     const groups = await this.groupModel
// // //       .find({ members: userObjectId })
// // //       .populate('members', 'username email') // Populate group members
// // //       .populate({
// // //         path: 'messages',
// // //         model: 'Message', // Ensure Mongoose knows which model to use for messages
// // //         populate: [
// // //           {
// // //             path: 'sender',
// // //             model: 'User', // Ensure Mongoose knows which model to use for sender
// // //             select: 'username email',
// // //           },
// // //           {
// // //             path: 'readBy.user',
// // //             model: 'User', // Ensure Mongoose knows which model to use for readBy.user
// // //             select: 'username email',
// // //           },
// // //         ],
// // //       })
// // //       .exec();

// // //     if (!groups || groups.length === 0) {
// // //       throw new NotFoundException('No groups found for the user');
// // //     }

// // //     // Map and format the response
// // //     return groups.map((group) => ({
// // //       id: group._id,
// // //       name: group.name,
// // //       description: group.description,
// // //       members: group.members,
// // //       messages: group.messages.map((message) => ({
// // //         id: message._id,
// // //         content: message.content,
// // //         type: message.type,
// // //         sender: message.sender,
// // //         attachments: message.attachments,
// // //         readBy: message.readBy,
// // //         createdAt: message.createdAt,
// // //         updatedAt: message.updatedAt,
// // //       })),
// // //     }));
// // //   }
// // // }

// // import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
// // import { InjectModel } from '@nestjs/mongoose';
// // import { Model, Types } from 'mongoose';
// // import { Group } from './group.schema';
// // import { CreateGroupDto, UpdateGroupDto } from './dto/group.dto';
// // import { WebSocketGateway } from '../gateways/websocket.gateway';

// // // Add interface for User
// // interface User {
// //   _id: Types.ObjectId;
// //   username: string;
// //   email: string;
// // }

// // interface Message {
// //   _id: Types.ObjectId;
// //   content: string;
// //   type: string;
// //   sender: User;
// //   attachments: string[];
// //   readBy: { user: User; readAt: Date }[];
// //   createdAt: Date;
// //   updatedAt: Date;
// // }

// // interface PopulatedGroup extends Omit<Group, 'members' | 'messages'> {
// //   members: User[];
// //   messages: Message[];
// // }

// // @Injectable()
// // export class GroupsService {
// //   constructor(
// //     @InjectModel('Group') private groupModel: Model<Group>,
// //     private readonly wsGateway: WebSocketGateway,
// //   ) {}

// //   async create(createGroupDto: CreateGroupDto, userId: Types.ObjectId): Promise<Group> {
// //     const group = new this.groupModel({
// //       ...createGroupDto,
// //       creator: userId,
// //       members: [userId], // Store just the ObjectId
// //     });
// //     return group.save();
// //   }

// //   async findAll(status?: 'public' | 'private'): Promise<PopulatedGroup[]> {
// //     const query = status ? { status } : {};
// //     return this.groupModel
// //       .find(query)
// //       .populate('members', 'username email') as Promise<PopulatedGroup[]>;
// //   }


// //   async findOne(id: string): Promise<Group> {
// //     const group = await this.groupModel.findById(id).populate('members', 'username email');
// //     if (!group) throw new NotFoundException('Group not found');
// //     return group;
// //   }

// //   async update(id: string, updateGroupDto: UpdateGroupDto, userId: Types.ObjectId): Promise<Group> {
// //     const group = await this.findOne(id);
// //     if (group.creator.toString() !== userId.toString()) {
// //       throw new ForbiddenException('Only group creator can update group');
// //     }
// //     return this.groupModel.findByIdAndUpdate(id, updateGroupDto, { new: true });
// //   }

// //   async delete(id: string, userId: Types.ObjectId): Promise<void> {
// //     const group = await this.findOne(id);
// //     if (group.creator.toString() !== userId.toString()) {
// //       throw new ForbiddenException('Only group creator can delete group');
// //     }
// //     await this.groupModel.findByIdAndDelete(id);
// //   }

// //   async joinGroup(groupId: string, userId: Types.ObjectId): Promise<Group> {
// //     const group = await this.findOne(groupId);
// //     if (group.status === 'private') {
// //       throw new ForbiddenException('Cannot join private group without invitation');
// //     }
// //     const isMember = group.members.some((member: User) => member._id.equals(userId));
// //     if (!isMember) {
// //       group.members.push({ _id: userId } as User); // Add with minimal user object
// //       await group.save();
// //     }
// //     return group;
// //   }

// //   async leaveGroup(groupId: string, userId: Types.ObjectId): Promise<void> {
// //     const group = await this.findOne(groupId);
// //     if (group.creator.toString() === userId.toString()) {
// //       throw new ForbiddenException('Group creator cannot leave the group');
// //     }
// //     group.members = group.members.filter((member: User) => !member._id.equals(userId));
// //     await group.save();
// //   }

// //   async joinByUserId(groupId: string, userId: string): Promise<Group> {
// //     const group = await this.groupModel.findById(groupId);

// //     if (!group) {
// //       throw new NotFoundException('Group not found');
// //     }

// //     const userObjectId = new Types.ObjectId(userId);
// //     const isMember = group.members.some((member: User) => member._id.equals(userObjectId));
    
// //     if (!isMember) {
// //       group.members.push({ _id: userObjectId } as User); // Add with minimal user object
// //       await group.save();
// //     }

// //     return group;
// //   }

// //   async getUserGroupsWithMessages(userId: string): Promise<any[]> {
// //     if (!Types.ObjectId.isValid(userId)) {
// //       throw new NotFoundException(`Invalid user ID: ${userId}`);
// //     }
// //     const userObjectId = new Types.ObjectId(userId);

// //     const groups = await this.groupModel
// //       .find({ members: userObjectId })
// //       .populate('members', 'username email')
// //       .populate({
// //         path: 'messages',
// //         model: 'Message',
// //         populate: [
// //           {
// //             path: 'sender',
// //             model: 'User',
// //             select: 'username email',
// //           },
// //           {
// //             path: 'readBy.user',
// //             model: 'User',
// //             select: 'username email',
// //           },
// //         ],
// //       })
// //       .exec();

// //     if (!groups || groups.length === 0) {
// //       throw new NotFoundException('No groups found for the user');
// //     }

// //     return groups.map((group) => ({
// //       id: group._id,
// //       name: group.name,
// //       description: group.description,
// //       members: group.members,
// //       messages: group.messages.map((message) => ({
// //         id: message._id,
// //         content: message.content,
// //         type: message.type,
// //         sender: message.sender,
// //         attachments: message.attachments,
// //         readBy: message.readBy,
// //         createdAt: message.createdAt,
// //         updatedAt: message.updatedAt,
// //       })),
// //     }));
// //   }
// // }


// // groups.service.ts
// import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model, Types } from 'mongoose';
// import { Group, GroupDocument } from '../group/group.schema';
// import { CreateGroupDto, UpdateGroupDto } from './dto/group.dto';
// import { WebSocketGateway } from '../gateways/websocket.gateway';
// import { PopulatedGroup } from '../interfaces/populated-group.interface';
// import { User } from '../interfaces/user.interface';
// import { Message } from '../interfaces/message.interface';

// @Injectable()
// export class GroupsService {
//   constructor(
//     @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
//     private readonly wsGateway: WebSocketGateway,
//   ) {}

//   async create(createGroupDto: CreateGroupDto, userId: Types.ObjectId): Promise<GroupDocument> {
//     const group = new this.groupModel({
//       ...createGroupDto,
//       creator: userId,
//       members: [userId],
//     });
//     return group.save();
//   }

//   async findAll(status?: 'public' | 'private'): Promise<PopulatedGroup[]> {
//     const query = status ? { status } : {};
//     return this.groupModel
//       .find(query)
//       .populate('members', 'username email')
//       .lean() as Promise<PopulatedGroup[]>;
//   }

//   async findOne(id: string): Promise<PopulatedGroup> {
//     if (!Types.ObjectId.isValid(id)) {
//       throw new NotFoundException('Invalid group ID');
//     }

//     const group = await this.groupModel
//       .findById(id)
//       .populate('members', 'username email')
//       .lean() as PopulatedGroup;

//     if (!group) {
//       throw new NotFoundException('Group not found');
//     }

//     return group;
//   }

//   async update(id: string, updateGroupDto: UpdateGroupDto, userId: Types.ObjectId): Promise<GroupDocument> {
//     const group = await this.findOne(id);
    
//     if (group.creator.toString() !== userId.toString()) {
//       throw new ForbiddenException('Only group creator can update group');
//     }

//     return this.groupModel
//       .findByIdAndUpdate(id, updateGroupDto, { new: true })
//       .populate('members', 'username email');
//   }

//   async delete(id: string, userId: Types.ObjectId): Promise<void> {
//     const group = await this.findOne(id);
    
//     if (group.creator.toString() !== userId.toString()) {
//       throw new ForbiddenException('Only group creator can delete group');
//     }

//     await this.groupModel.findByIdAndDelete(id);
//   }

//   async joinGroup(groupId: string, userId: Types.ObjectId): Promise<PopulatedGroup> {
//     const group = await this.findOne(groupId);
    
//     if (group.status === 'private') {
//       throw new ForbiddenException('Cannot join private group without invitation');
//     }

//     const isMember = group.members.some(member => member._id.equals(userId));
    
//     if (!isMember) {
//       await this.groupModel.findByIdAndUpdate(
//         groupId,
//         { $addToSet: { members: userId } },
//         { new: true }
//       );
//     }

//     return this.findOne(groupId);
//   }

//   async leaveGroup(groupId: string, userId: Types.ObjectId): Promise<void> {
//     const group = await this.findOne(groupId);
    
//     if (group.creator.toString() === userId.toString()) {
//       throw new ForbiddenException('Group creator cannot leave the group');
//     }

//     await this.groupModel.findByIdAndUpdate(
//       groupId,
//       { $pull: { members: userId } }
//     );
//   }

//   async joinByUserId(groupId: string, userId: string): Promise<PopulatedGroup> {
//     if (!Types.ObjectId.isValid(userId)) {
//       throw new NotFoundException('Invalid user ID');
//     }

//     const userObjectId = new Types.ObjectId(userId);
//     const group = await this.findOne(groupId);

//     const isMember = group.members.some(member => member._id.equals(userObjectId));
    
//     if (!isMember) {
//       await this.groupModel.findByIdAndUpdate(
//         groupId,
//         { $addToSet: { members: userObjectId } },
//         { new: true }
//       );
//     }

//     return this.findOne(groupId);
//   }

//   async getUserGroupsWithMessages(userId: string): Promise<PopulatedGroup[]> {
//     if (!Types.ObjectId.isValid(userId)) {
//       throw new NotFoundException('Invalid user ID');
//     }

//     const userObjectId = new Types.ObjectId(userId);
//     const groups = await this.groupModel
//       .find({ members: userObjectId })
//       .populate('members', 'username email')
//       .populate({
//         path: 'messages',
//         populate: [
//           {
//             path: 'sender',
//             model: 'User',
//             select: 'username email',
//           },
//           {
//             path: 'readBy.user',
//             model: 'User',
//             select: 'username email',
//           },
//         ],
//       })
//       .lean() as PopulatedGroup[];

//     if (!groups || groups.length === 0) {
//       throw new NotFoundException('No groups found for the user');
//     }

//     return groups.map(group => ({
//       ...group,
//       messages: group.messages.map(message => ({
//         id: message._id,
//         content: message.content,
//         type: message.type,
//         sender: message.sender,
//         attachments: message.attachments,
//         readBy: message.readBy,
//         createdAt: message.createdAt,
//         updatedAt: message.updatedAt,
//       })),
//     }));
//   }
// }


// groups.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Group, GroupDocument } from './group.schema';
import { CreateGroupDto, UpdateGroupDto } from './dto/group.dto';
import { WebSocketGateway } from '../gateways/websocket.gateway';
import { PopulatedGroup } from '../interfaces/populated-group.interface';
import { User } from '../interfaces/user.interface';
import { Message } from '../interfaces/message.interface';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
    private readonly wsGateway: WebSocketGateway,
  ) {}

  async create(createGroupDto: CreateGroupDto, userId: Types.ObjectId): Promise<GroupDocument> {
    const group = new this.groupModel({
      ...createGroupDto,
      creator: userId,
      members: [userId],
    });
    return group.save();
  }

  async findAll(status?: 'public' | 'private'): Promise<PopulatedGroup[]> {
    const query = status ? { status } : {};
    const groups = await this.groupModel
      .find(query)
      .populate('members', 'username email')
      .lean();

    return groups.map(group => this.mapToPopulatedGroup(group));
  }

  async findOne(id: string): Promise<PopulatedGroup> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid group ID');
    }

    const group = await this.groupModel
      .findById(id)
      .populate('members', 'username email')
      .lean();

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    return this.mapToPopulatedGroup(group);
  }

  async update(id: string, updateGroupDto: UpdateGroupDto, userId: Types.ObjectId): Promise<PopulatedGroup> {
    const group = await this.findOne(id);
    
    if (group.creator.toString() !== userId.toString()) {
      throw new ForbiddenException('Only group creator can update group');
    }

    const updatedGroup = await this.groupModel
      .findByIdAndUpdate(id, updateGroupDto, { new: true })
      .populate('members', 'username email')
      .lean();

    return this.mapToPopulatedGroup(updatedGroup!);
  }

  async delete(id: string, userId: Types.ObjectId): Promise<void> {
    const group = await this.findOne(id);
    
    if (group.creator.toString() !== userId.toString()) {
      throw new ForbiddenException('Only group creator can delete group');
    }

    await this.groupModel.findByIdAndDelete(id);
  }

  async joinGroup(groupId: string, userId: Types.ObjectId): Promise<PopulatedGroup> {
    const group = await this.findOne(groupId);
    
    if (group.status === 'private') {
      throw new ForbiddenException('Cannot join private group without invitation');
    }

    const isMember = group.members.some(member => member._id.equals(userId));
    
    if (!isMember) {
      await this.groupModel.findByIdAndUpdate(
        groupId,
        { $addToSet: { members: userId } }
      );
    }

    return this.findOne(groupId);
  }

  async leaveGroup(groupId: string, userId: Types.ObjectId): Promise<void> {
    const group = await this.findOne(groupId);
    
    if (group.creator.toString() === userId.toString()) {
      throw new ForbiddenException('Group creator cannot leave the group');
    }

    await this.groupModel.findByIdAndUpdate(
      groupId,
      { $pull: { members: userId } }
    );
  }

  async joinByUserId(groupId: string, userId: string): Promise<PopulatedGroup> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new NotFoundException('Invalid user ID');
    }

    const userObjectId = new Types.ObjectId(userId);
    const group = await this.findOne(groupId);

    const isMember = group.members.some(member => member._id.equals(userObjectId));
    
    if (!isMember) {
      await this.groupModel.findByIdAndUpdate(
        groupId,
        { $addToSet: { members: userObjectId } }
      );
    }

    return this.findOne(groupId);
  }

  async getUserGroupsWithMessages(userId: string): Promise<PopulatedGroup[]> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new NotFoundException('Invalid user ID');
    }

    const userObjectId = new Types.ObjectId(userId);
    const groups = await this.groupModel
      .find({ members: userObjectId })
      .populate('members', 'username email')
      .populate({
        path: 'messages',
        populate: [
          {
            path: 'sender',
            model: 'User',
            select: 'username email',
          },
          {
            path: 'readBy.user',
            model: 'User',
            select: 'username email',
          },
        ],
      })
      .lean();

    if (!groups || groups.length === 0) {
      throw new NotFoundException('No groups found for the user');
    }

    return groups.map(group => this.mapToPopulatedGroup(group));
  }

  private mapToPopulatedGroup(group: any): PopulatedGroup {
    return {
      _id: group._id,
      name: group.name,
      description: group.description,
      creator: group.creator,
      status: group.status,
      members: group.members.map((member: any) => ({
        _id: member._id,
        username: member.username,
        email: member.email,
      })),
      messages: group.messages?.map((message: any) => ({
        _id: message._id,
        content: message.content,
        type: message.type,
        sender: {
          _id: message.sender._id,
          username: message.sender.username,
          email: message.sender.email,
        },
        attachments: message.attachments,
        readBy: message.readBy.map((readBy: any) => ({
          user: {
            _id: readBy.user._id,
            username: readBy.user.username,
            email: readBy.user.email,
          },
          readAt: readBy.readAt,
        })),
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
      })) || [],
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
    };
  }
}