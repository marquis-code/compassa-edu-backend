// messages/messages.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './message.schema';
import { MessagesService } from './message.service';
import { MessagesController } from './messages.controller';
import { SharedModule } from '../shared.module';
// import { WebSocketGateway } from '../gateways/websocket.gateway';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module'; // Import UserModule
import { GatewayModule } from '../gateways/gateway.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    forwardRef(() => AuthModule),
    forwardRef(() => SharedModule),
    forwardRef(() => UserModule), // Add UserModule to imports
    forwardRef(() => GatewayModule)
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService]
})
export class MessagesModule {}

// import { Module, forwardRef } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { Message, MessageSchema } from './message.schema';
// import { MessagesService } from './message.service';
// import { MessagesController } from './messages.controller';
// import { SharedModule } from '../shared.module';

// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
//     forwardRef(() => SharedModule), // Import SharedModule
//   ],
//   controllers: [MessagesController],
//   providers: [MessagesService],
//   exports: [MessagesService],
// })
// export class MessagesModule {}
