// groups/groups.controller.ts
import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { GroupsService } from './group.service';
import { CreateGroupDto, UpdateGroupDto } from './dto/group.dto';
import { AuthGuard } from "../auth/auth.guard"

@Controller('groups')
@UseGuards(AuthGuard) 
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  create(@Body() createGroupDto: CreateGroupDto, @Request() req) {
    return this.groupsService.create(createGroupDto, req.user.id);
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
    return this.groupsService.joinGroup(groupId, req.user.id); // Call the service with groupId and userId
  }
}
