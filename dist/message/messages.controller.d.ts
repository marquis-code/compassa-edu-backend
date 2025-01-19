import { MessagesService } from './message.service';
import { CreateMessageDto } from './dto/message.dto';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    create(createMessageDto: CreateMessageDto, req: any): Promise<import("./message.schema").Message>;
    findGroupMessages(groupId: string): Promise<import("./message.schema").Message[]>;
    getUnreadMessages(groupId: string, req: any): Promise<import("./message.schema").Message[]>;
    markMessagesAsRead(groupId: string, req: any): Promise<void>;
}
