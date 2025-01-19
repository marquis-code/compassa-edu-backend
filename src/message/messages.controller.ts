
// messages/messages.controller.ts
import { Controller, Post, Get, Param, Body, UseGuards, Request } from '@nestjs/common';
import { MessagesService } from './message.service';
import { CreateMessageDto } from './dto/message.dto';
import { AuthGuard } from "../auth/auth.guard"

@Controller('messages')
@UseGuards(AuthGuard) // Ensure only authenticated users can access these routes
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  create(@Body() createMessageDto: CreateMessageDto, @Request() req) {
    return this.messagesService.create(createMessageDto, req.user.id);
  }

  @Get('group/:groupId')
  findGroupMessages(@Param('groupId') groupId: string) {
    return this.messagesService.findGroupMessages(groupId);
  }

  @Get('group/:groupId/unread')
  getUnreadMessages(@Param('groupId') groupId: string, @Request() req) {
    return this.messagesService.getUnreadMessages(groupId, req.user.id);
  }

  @Post('group/:groupId/mark-read')
markMessagesAsRead(@Param('groupId') groupId: string, @Request() req) {
  return this.messagesService.markMessagesAsRead(groupId, req.user.id);
}
}
