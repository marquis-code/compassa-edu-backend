// gateway/gateway.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { WebSocketGateway } from './websocket.gateway';
import { MessagesModule } from '../message/messages.module';
import { JwtModule } from '@nestjs/jwt';
import { GroupsModule } from '../group/group.module';
import { WsJwtGuard } from '../auth/ws-jwt.guard';

@Module({
  imports: [
    JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '24h' }, // adjust as needed
      }),
    forwardRef(() => MessagesModule),
    forwardRef(() => GroupsModule),
  ],
  providers: [WebSocketGateway, WsJwtGuard],
  exports: [WebSocketGateway, WsJwtGuard],
})
export class GatewayModule {}