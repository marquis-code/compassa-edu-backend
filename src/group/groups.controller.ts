// groups/groups.controller.ts
import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { GroupsService } from './group.service';
import { CreateGroupDto, UpdateGroupDto } from './dto/group.dto';
import { AuthGuard } from "../auth/auth.guard"
import { Model, Types } from 'mongoose';

@Controller('groups')
@UseGuards(AuthGuard) 
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  create(@Body() createGroupDto: CreateGroupDto, @Request() req) {
    return this.groupsService.create(createGroupDto, req.user.id);
  }

  @Get('my-groups') // Specific route for fetching user groups
  getUserGroups(@Request() req) {
    const userId = req.user.id; // Extract the logged-in user's ID
    return this.groupsService.findUserGroups(userId); // Call the service method
  }

  
  @Get()
  findAll() {
    return this.groupsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto, @Request() req) {
    return this.groupsService.update(id, updateGroupDto, req.user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Request() req) {
    return this.groupsService.delete(id, req.user.id);
  }

  @Post('join-by-user/:groupId/:userId')
  joinGroupByUserId(@Param('groupId') groupId: string, @Param('userId') userId: string) {
 return this.groupsService.joinByUserId(groupId, userId);
}

@Post('join/:groupId') // Route for joining a group
joinGroup(@Param('groupId') groupId: string, @Request() req) {
  // Convert groupId string to ObjectId
  // const groupObjectId = new ObjectId(groupId);
  const groupObjectId = new Types.ObjectId(groupId);
  return this.groupsService.joinGroup(groupObjectId, req.user.id); // Call the service with ObjectId and userId
}

  // @Post('join/:groupId') // Route for joining a group
  // joinGroup(@Param('groupId') groupId: string, @Request() req) {
  //   return this.groupsService.joinGroup(groupId, req.user.id); // Call the service with groupId and userId
  // }

  // @Get('user-groups') // Endpoint to fetch the logged-in user's groups
  // getUserGroups(@Request() req) {
  //   console.log('Logged-in user ID:', req.user.id); // Log the user ID
  //   return this.groupsService.getUserGroupsWithMessages(req.user.id); // Fetch groups the user belongs to
  // }

//   @Get('my-groups')
// getUserGroups(@Request() req) {
//   const userId = req.user.id; // Extract the logged-in user's ID
//   return this.groupsService.findUserGroups(userId); // Call the service method
// }
}
