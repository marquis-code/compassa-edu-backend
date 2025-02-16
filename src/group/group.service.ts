// groups.service.ts
import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
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
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly wsGateway: WebSocketGateway,
  ) {}


  async create(
    createGroupDto: CreateGroupDto,
    userId: Types.ObjectId
  ): Promise<GroupDocument> {
    // Create the group
    const group = new this.groupModel({
      ...createGroupDto,
      status: createGroupDto.status || 'public',
      creator: userId,
      members: [userId], // Ensure the creator is added as the first member
    });
  
    console.log('Creating group with members:', group.members); // Debugging
  
    // Save the group
    const savedGroup = await group.save();
  
    // Update the user's profile to include the group
    await this.userModel.findByIdAndUpdate(userId, {
      $addToSet: { groups: savedGroup._id },
    });
  
    return savedGroup;
  }
  
  
  async findAll(status?: 'public' | 'private'): Promise<any[]> {
    const query = status ? { status } : {}; // If a status is provided, filter by it; otherwise, return all groups
    const groups = await this.groupModel.find(query).lean(); // Fetch groups without populating
  
    return groups; // Return the raw groups without modifications
  }
  

  // async create(createGroupDto: CreateGroupDto, userId: Types.ObjectId): Promise<GroupDocument> {
  //   const group = new this.groupModel({
  //     ...createGroupDto,
  //     creator: userId,
  //     members: [userId],
  //   });
  //   return group.save();
  // }

  // async findAll(status?: 'public' | 'private'): Promise<PopulatedGroup[]> {
  //   const query = status ? { status } : {};
  //   const groups = await this.groupModel
  //     .find(query)
  //     .lean();

  //     // return groups

  //   // return groups.map(group => this.mapToPopulatedGroup(group));
  // }

  // async findOne(id: string): Promise<PopulatedGroup> {
  //   if (!Types.ObjectId.isValid(id)) {
  //     throw new NotFoundException('Invalid group ID');
  //   }

  //   const group = await this.groupModel
  //     .findById(id)
  //     .populate('members', 'username email')
  //     .lean();

  //   if (!group) {
  //     throw new NotFoundException('Group not found');
  //   }

  //   return this.mapToPopulatedGroup(group);
  // }

  async findOne(id: string): Promise<PopulatedGroup> {
    console.log('Validating group ID:', id);
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid group ID: ${id}`);
    }
  
    const group = await this.groupModel
      .findById(id)
      .populate('members', 'username email') // Populate members to verify their structure
      .lean();
  
    if (!group) {
      throw new NotFoundException(`Group not found with ID: ${id}`);
    }
  
    console.log('Group members:', group.members); // Log members for debugging
  
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

  // async joinGroup(groupId: string, userId: Types.ObjectId): Promise<PopulatedGroup> {
  //   const group = await this.findOne(groupId);
    
  //   if (group.status === 'private') {
  //     throw new ForbiddenException('Cannot join private group without invitation');
  //   }

  //   const isMember = group.members.some(member => member._id.equals(userId));
    
  //   if (!isMember) {
  //     await this.groupModel.findByIdAndUpdate(
  //       groupId,
  //       { $addToSet: { members: userId } }
  //     );
  //   }

  //   return this.findOne(groupId);
  // }
  // async joinGroup(groupId: Types.ObjectId, userId: Types.ObjectId): Promise<PopulatedGroup> {
  //   console.log(groupId, 'groip id')
  //   console.log(userId, 'groip id')
  //   const group = await this.groupModel.findOne(groupId);
  
  //   if (group.status === 'private') {
  //     throw new ForbiddenException('Cannot join private group without invitation');
  //   }
  
  //   const isMember = group.members.some(member => member._id?.equals?.(userId));
  //   if (!isMember) {
  //     await this.groupModel.findByIdAndUpdate(
  //       groupId,
  //       { $addToSet: { members: userId } }
  //     );
  //   }
  
  //   return this.groupModel.findOne(groupId);
  // }

  async joinGroup(
    groupId: Types.ObjectId,
    userId: Types.ObjectId
  ): Promise<PopulatedGroup> {
    console.log(groupId, 'group id');
    console.log(userId, 'user id');
  
    // Find the group
    const group = await this.groupModel.findById(groupId);
    if (!group) {
      throw new NotFoundException('Group not found');
    }
  
    // Check if the group is private
    if (group.status === 'private') {
      throw new ForbiddenException(
        'Cannot join a private group without an invitation'
      );
    }
  
    // Check if the user is already a member
    const isMember = group.members.some((member) =>
      member._id?.equals?.(userId)
    );
    if (!isMember) {
      // Add the user to the group's members
      await this.groupModel.findByIdAndUpdate(groupId, {
        $addToSet: { members: userId },
      });
  
      // Update the user's groups
      await this.userModel.findByIdAndUpdate(userId, {
        $addToSet: { groups: groupId },
      });
    }
  
    // Return the updated group with all fields populated
    return this.groupModel
      .findById(groupId)
      .populate('members') // Populate members
      .lean() as unknown as PopulatedGroup; // Ensure it matches PopulatedGroup type
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

  // async joinByUserId(groupId: string, userId: Types.ObjectId): Promise<PopulatedGroup> {
  //   // Validate the user ID
  //   if (!Types.ObjectId.isValid(userId)) {
  //     throw new NotFoundException('Invalid user ID');
  //   }
  
  //   const userObjectId = new Types.ObjectId(userId);
  
  //   // Find the group
  //   const group = await this.findOne(groupId);
  
  //   // Safely check if the user is a member of the group
  //   const isMember = group.members.some(
  //     (member) => member && member._id && new Types.ObjectId(member._id).equals(userObjectId)
  //   );
  
  //   // Add the user to the group if they are not a member
  //   if (!isMember) {
  //     await this.groupModel.findByIdAndUpdate(
  //       groupId,
  //       { $addToSet: { members: userObjectId } }
  //     );
  //   }
  
  //   // Return the updated group
  //   return this.findOne(groupId);
  // }
  
  // async joinByUserId(groupId: string, userId: string): Promise<PopulatedGroup> {
  //   if (!Types.ObjectId.isValid(userId)) {
  //     throw new NotFoundException('Invalid user ID');
  //   }

  //   const userObjectId = new Types.ObjectId(userId);
  //   const group = await this.findOne(groupId);

  //   const isMember = group.members.some(member => member._id.equals(userObjectId));
    
  //   if (!isMember) {
  //     await this.groupModel.findByIdAndUpdate(
  //       groupId,
  //       { $addToSet: { members: userObjectId } }
  //     );
  //   }

  //   return this.findOne(groupId);
  // }

  async joinByUserId(groupId: string, userId: string): Promise<PopulatedGroup> {
    // Validate the user ID format before conversion
    if (!Types.ObjectId.isValid(userId)) {
      throw new NotFoundException('Invalid user ID');
    }
  
    const userObjectId = new Types.ObjectId(userId);
  
    // Find the group
    const group = await this.findOne(groupId);
  
    // Safely check if the user is already a member of the group
    const isMember = group.members.some(
      (member) => member?._id?.toString() === userObjectId.toString()
    );
  
    // Add the user to the group if they are not a member
    if (!isMember) {
      await this.groupModel.findByIdAndUpdate(
        groupId,
        { $addToSet: { members: userObjectId } },
        { new: true }
      );
    }
  
    // Return the updated group
    return this.findOne(groupId);
  }

  

  async getUserGroupsWithMessages(userId: string): Promise<PopulatedGroup[]> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new NotFoundException(`Invalid user ID: ${userId}`);
    }
  
    const groups = await this.groupModel
      .find({ members: new Types.ObjectId(userId) })
      .populate('members', 'username email')
      .populate({
        path: 'messages',
        populate: [
          { path: 'sender', model: 'User', select: 'username email' },
          { path: 'readBy.user', model: 'User', select: 'username email' },
        ],
      })
      .lean();
  
    if (!groups || groups.length === 0) {
      throw new NotFoundException(`No groups found for user ID: ${userId}`);
    }
  
    return groups.map(group => this.mapToPopulatedGroup(group));
  }
  

  // async getUserGroupsWithMessages(userId: string): Promise<PopulatedGroup[]> {
  //   if (!Types.ObjectId.isValid(userId)) {
  //     throw new NotFoundException(`Invalid user ID: ${userId}`);
  //   }
  
  //   const userObjectId = new Types.ObjectId(userId);
  //   const groups = await this.groupModel
  //     .find({ members: userObjectId })
  //     .populate('members', 'username email')
  //     .populate({
  //       path: 'messages',
  //       populate: [
  //         { path: 'sender', model: 'User', select: 'username email' },
  //         { path: 'readBy.user', model: 'User', select: 'username email' },
  //       ],
  //     })
  //     .lean();
  
  //   if (!groups || groups.length === 0) {
  //     throw new NotFoundException(`No groups found for user ID: ${userId}`);
  //   }
  
  //   return groups.map(group => this.mapToPopulatedGroup(group));
  // }

  
  // async getUserGroupsWithMessages(userId: string): Promise<PopulatedGroup[]> {
  //   if (!Types.ObjectId.isValid(userId)) {
  //     throw new NotFoundException('Invalid user ID');
  //   }

  //   const userObjectId = new Types.ObjectId(userId);
  //   const groups = await this.groupModel
  //     .find({ members: userObjectId })
  //     .populate('members', 'username email')
  //     .populate({
  //       path: 'messages',
  //       populate: [
  //         {
  //           path: 'sender',
  //           model: 'User',
  //           select: 'username email',
  //         },
  //         {
  //           path: 'readBy.user',
  //           model: 'User',
  //           select: 'username email',
  //         },
  //       ],
  //     })
  //     .lean();

  //   if (!groups || groups.length === 0) {
  //     throw new NotFoundException('No groups found for the user');
  //   }

  //   return groups.map(group => this.mapToPopulatedGroup(group));
  // }

  // private mapToPopulatedGroup(group: any): PopulatedGroup {
  //   return {
  //     _id: group._id,
  //     name: group.name,
  //     description: group.description,
  //     creator: group.creator,
  //     status: group.status,
  //     members: group.members.map((member: any) => ({
  //       _id: member._id,
  //       username: member.username,
  //       email: member.email,
  //     })),
  //     messages: group.messages?.map((message: any) => ({
  //       _id: message._id,
  //       content: message.content,
  //       type: message.type,
  //       sender: {
  //         _id: message.sender._id,
  //         username: message.sender.username,
  //         email: message.sender.email,
  //       },
  //       attachments: message.attachments,
  //       readBy: message.readBy.map((readBy: any) => ({
  //         user: {
  //           _id: readBy.user._id,
  //           username: readBy.user.username,
  //           email: readBy.user.email,
  //         },
  //         readAt: readBy.readAt,
  //       })),
  //       createdAt: message.createdAt,
  //       updatedAt: message.updatedAt,
  //     })) || [],
  //     createdAt: group.createdAt,
  //     updatedAt: group.updatedAt,
  //   };
  // }
  private mapToPopulatedGroup(group: any): PopulatedGroup {
    return {
      _id: group._id,
      name: group.name,
      description: group.description,
      creator: group.creator,
      status: group.status,
      members: group.members?.map((member: any) => ({
        _id: member?._id || 'Unknown',
        username: member?.username || 'Unknown',
        email: member?.email || 'Unknown',
      })) || [],
      messages: group.messages || [],
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
    };
  }

  async findUserGroups(userId: string): Promise<any[]> {
    console.log(userId, 'uer if from user grope')
    if (!Types.ObjectId.isValid(userId)) {
      throw new NotFoundException(`Invalid user ID: ${userId}`);
    }
  
    const userObjectId = new Types.ObjectId(userId);
    const groups = await this.groupModel
      .find({ members: userId }) // Filter groups where the user is a member
      .lean(); // Return plain JavaScript objects
  
    return groups; // Return the filtered groups
  }



  async joinGroupByInvite(inviteToken: string, userId: Types.ObjectId) {
    const group = await this.groupModel.findOne({ inviteToken });
    if (!group) {
      throw new NotFoundException('Invalid or expired invite link');
    }

    const isMember = group.members.some((member) => member.equals(userId));
    if (isMember) {
      throw new BadRequestException('You are already a member of this group');
    }

    await this.groupModel.findByIdAndUpdate(group._id, {
      $addToSet: { members: userId },
    });

    await this.userModel.findByIdAndUpdate(userId, {
      $addToSet: { groups: group._id },
    });

    return this.groupModel.findById(group._id).populate('members').lean();
  }

  // async generateInviteLink(groupId: Types.ObjectId, userId: Types.ObjectId) {
  //   const group = await this.groupModel.findById(groupId);
  //   if (!group) {
  //     throw new NotFoundException('Group not found');
  //   }

  //   if (!group.creator.equals(userId)) {
  //     throw new ForbiddenException('Only the group creator can generate invite links');
  //   }

  //   const inviteToken = new Types.ObjectId().toHexString();

  //   await this.groupModel.findByIdAndUpdate(groupId, { inviteToken });

  //   return {
  //     inviteLink: `${process.env.APP_URL}/join-by-invite/${inviteToken}`,
  //   };
  // }

  async generateInviteLink(groupId: Types.ObjectId, userId: Types.ObjectId) {
    const group = await this.groupModel.findById(groupId);
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    // Convert both IDs to strings for a reliable comparison
    if (group.creator.toString() !== userId.toString()) {
      throw new ForbiddenException('Only the group creator can generate invite links');
    }

    const inviteToken = new Types.ObjectId().toHexString();

    await this.groupModel.findByIdAndUpdate(groupId, { inviteToken });

    return {
      inviteLink: `${process.env.APP_URL}/join-by-invite/${inviteToken}`,
    };
  }


  // group.service.ts
// group.service.ts
// async createGroup(
//   createGroupDto: CreateGroupDto & { matricNumbers: string[] },
//   userId: Types.ObjectId
// ): Promise<GroupDocument> {
//   const { matricNumbers, ...groupData } = createGroupDto;

//   // Verify if all users exist
//   const users = await this.userModel.find({ matric: { $in: matricNumbers } });
//   if (users.length !== matricNumbers.length) {
//     throw new Error('One or more matric numbers do not exist in the system');
//   }

//   // Create the group
//   const group = new this.groupModel({
//     ...groupData,
//     status: groupData.status || 'public',
//     creator: userId,
//     members: [userId], // Ensure the creator is added as the first member
//   });

//   console.log('Creating group with members:', group.members);

//   // Save the group
//   const savedGroup = await group.save();

//   const userIds = users.map(user => user._id);
  
//   // Add users to the group
//   await this.groupModel.findByIdAndUpdate(savedGroup._id, {
//     $addToSet: { members: { $each: userIds } },
//   });

//   // Update users' profiles to include the group
//   await this.userModel.updateMany(
//     { _id: { $in: userIds } },
//     { $addToSet: { groups: savedGroup._id } }
//   );

//   return this.groupModel.findById(savedGroup._id).populate('members');
// }

// async createGroup(
//   createGroupDto: CreateGroupDto & { matricNumbers: string[] },
//   userId: Types.ObjectId
// ): Promise<GroupDocument | { message: string; missingMatricNumbers: string[] }> {
//   const { matricNumbers, ...groupData } = createGroupDto;

//   // Verify if all users exist
//   const users = await this.userModel.find({ matric: { $in: matricNumbers } }).lean();
//   const foundMatricNumbers = users.map((user: any) => user.matric);
//   const missingMatricNumbers = matricNumbers.filter(matric => !foundMatricNumbers.includes(matric));
//   // const users = await this.userModel.find({ matric: { $in: matricNumbers } });
//   // const foundMatricNumbers = users.map(user => user.matric);
//   // const missingMatricNumbers = matricNumbers.filter(matric => !foundMatricNumbers.includes(matric));

//   if (missingMatricNumbers.length > 0) {
//     return {
//       message: 'Some users do not exist in the system.',
//       missingMatricNumbers,
//     };
//   }

//   // Create the group
//   const group = new this.groupModel({
//     ...groupData,
//     status: groupData.status || 'public',
//     creator: userId,
//     members: [userId], // Ensure the creator is added as the first member
//   });

//   console.log('Creating group with members:', group.members);

//   // Save the group
//   const savedGroup = await group.save();

//   const userIds = users.map(user => user._id);
  
//   // Add users to the group
//   await this.groupModel.findByIdAndUpdate(savedGroup._id, {
//     $addToSet: { members: { $each: userIds } },
//   });

//   // Update users' profiles to include the group
//   await this.userModel.updateMany(
//     { _id: { $in: userIds } },
//     { $addToSet: { groups: savedGroup._id } }
//   );

//   return this.groupModel.findById(savedGroup._id).populate('members');
// }

// group.service.ts
// async createGroup(
//   createGroupDto: CreateGroupDto & { matricNumbers: string[] },
//   userId: Types.ObjectId
// ): Promise<GroupDocument> {
//   const { matricNumbers, ...groupData } = createGroupDto;

//   // Verify if all users exist
//   const users = await this.userModel.find({ matric: { $in: matricNumbers } }).lean();
//   const foundMatricNumbers = users.map((user: any) => user.matric);
//   const missingMatricNumbers = matricNumbers.filter(matric => !foundMatricNumbers.includes(matric));

//   if (missingMatricNumbers.length > 0) {
//     throw new BadRequestException({
//       message: 'Some users do not exist in the system.',
//       missingMatricNumbers,
//     });
//   }

//   // Create the group
//   const group = new this.groupModel({
//     ...groupData,
//     status: groupData.status || 'public',
//     creator: userId,
//     members: [userId], // Ensure the creator is added as the first member
//   });

//   console.log('Creating group with members:', group.members);

//   // Save the group
//   const savedGroup = await group.save();

//   const userIds = users.map(user => user._id);
  
//   // Add users to the group
//   await this.groupModel.findByIdAndUpdate(savedGroup._id, {
//     $addToSet: { members: { $each: userIds } },
//   });

//   // Update users' profiles to include the group
//   await this.userModel.updateMany(
//     { _id: { $in: userIds } },
//     { $addToSet: { groups: savedGroup._id } }
//   );

//   return this.groupModel.findById(savedGroup._id).populate('members');
// }

// group.service.ts
// async createGroup(
//   createGroupDto: CreateGroupDto & { matricNumbers: string[] },
//   userId: Types.ObjectId
// ): Promise<GroupDocument> {
//   const { matricNumbers, ...groupData } = createGroupDto;

//   // Verify if all users exist
//   const users = await this.userModel.find({ matric: { $in: matricNumbers } }).lean();
//   const foundMatricNumbers = users.map((user: any) => user.matric);
//   const missingMatricNumbers = matricNumbers.filter(matric => !foundMatricNumbers.includes(matric));

//   if (missingMatricNumbers.length > 0) {
//     throw new BadRequestException({
//       message: 'Some users do not exist in the system.',
//       missingMatricNumbers,
//     });
//   }

//   // Get user IDs including the creator
//   const userIds = users.map(user => user._id);
//   if (!userIds.includes(userId)) {
//     userIds.push(userId); // Ensure the creator is also included
//   }

//   // Create the group
//   const group = new this.groupModel({
//     ...groupData,
//     status: groupData.status || 'public',
//     creator: userId,
//     members: userIds, // Ensure correct structure
//   });

//   console.log('Creating group with members:', group.members);

//   // Save the group
//   const savedGroup = await group.save();
  
//   // Update users' profiles to include the group
//   await this.userModel.updateMany(
//     { _id: { $in: userIds } },
//     { $addToSet: { groups: savedGroup._id } }
//   );

//   return this.groupModel.findById(savedGroup._id).populate('members');
// }

// group.service.ts
async createGroup(
  createGroupDto: CreateGroupDto & { matricNumbers: string[] },
  userId: Types.ObjectId
): Promise<GroupDocument> {
  const { matricNumbers, ...groupData } = createGroupDto;

  // Verify if all users exist
  const users = await this.userModel.find({ matric: { $in: matricNumbers } }).lean();
  const foundMatricNumbers = users.map((user: any) => user.matric);
  const missingMatricNumbers = matricNumbers.filter(matric => !foundMatricNumbers.includes(matric));

  if (missingMatricNumbers.length > 0) {
    throw new BadRequestException({
      message: 'Some users do not exist in the system.',
      missingMatricNumbers,
    });
  }

  // Get user IDs including the creator
  const userIds = users.map(user => user._id.toString());
  if (!userIds.includes(userId.toString())) {
    userIds.push(userId.toString()); // Ensure the creator is also included
  }

  // Create the group
  const group = new this.groupModel({
    ...groupData,
    status: groupData.status || 'public',
    creator: userId.toString(),
    members: userIds, // Store as plain string IDs
  });

  console.log('Creating group with members:', group.members);

  // Save the group
  const savedGroup = await group.save();
  
  // Update users' profiles to include the group
  await this.userModel.updateMany(
    { _id: { $in: userIds.map(id => new Types.ObjectId(id)) } },
    { $addToSet: { groups: savedGroup._id } }
  );

  return this.groupModel.findById(savedGroup._id).lean(); // Ensure response is plain JSON
}

}