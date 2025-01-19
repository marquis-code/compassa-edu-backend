// messages/messages.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './message.schema';
import { MessagesService } from './message.service';
import { MessagesController } from './messages.controller';
// import { WebSocketGateway } from '../gateways/websocket.gateway';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module'; // Import UserModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule), // Add UserModule to imports
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
