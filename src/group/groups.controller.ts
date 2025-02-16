// groups/groups.controller.ts
import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards, Request, Logger } from '@nestjs/common';
import { GroupsService } from './group.service';
import { CreateGroupDto, UpdateGroupDto } from './dto/group.dto';
import { AuthGuard } from "../auth/auth.guard"
import { Model, Types } from 'mongoose';

const logger = new Logger('Bootstrap');

@Controller('groups')
@UseGuards(AuthGuard) 
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}
  @Post()
  create(@Body() createGroupDto: CreateGroupDto, @Request() req) {
    return this.groupsService.create(createGroupDto, req.user.id);
  }

//   @Post('create-with-members')
// async createGroup(
//   @Body() createGroupDto: CreateGroupDto & { matricNumbers: string[] },
//   @Request() req
// ) {
//   return this.groupsService.createGroup(createGroupDto, req.user.id);
// }

@Post('create-with-members')
async createGroup(
  @Body() createGroupDto: CreateGroupDto & { matricNumbers: string[] },
  @Request() req
) {
  return this.groupsService.createGroup(createGroupDto, req.user.id);
}


  @Get('my-groups')
getUserGroups(@Request() req) {
  logger.log('Request Object:', req);
  logger.log('Request User Object:', req.user);
  logger.log('User ID from request:', req.user.id);
  const userId = req.user.id;
  return this.groupsService.findUserGroups(userId);
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

@Post('leave-group/:groupId/:userId')
leaveGroupByUserId(
  @Param('groupId') groupId: string, 
  @Param('userId') userId: string
) {
  return this.groupsService.leaveGroup(groupId, new Types.ObjectId(userId));
}

@Post('join/:groupId') // Route for joining a group
joinGroup(@Param('groupId') groupId: string, @Request() req) {
  // Convert groupId string to ObjectId
  // const groupObjectId = new ObjectId(groupId);
  const groupObjectId = new Types.ObjectId(groupId);
  return this.groupsService.joinGroup(groupObjectId, req.user.id); // Call the service with ObjectId and userId
}


@Post('join-by-invite/:inviteToken')
async joinGroupByInvite(
  @Param('inviteToken') inviteToken: string,
  @Request() req
) {
  return this.groupsService.joinGroupByInvite(inviteToken, new Types.ObjectId(req.user.id));
}

@Post('generate-invite/:groupId')
async generateInviteLink(
  @Param('groupId') groupId: string,
  @Request() req
) {
  return this.groupsService.generateInviteLink(new Types.ObjectId(groupId), new Types.ObjectId(req.user.id));
}

}
