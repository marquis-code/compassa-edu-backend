// import { Global, Module } from '@nestjs/common';
// import { WebSocketGateway } from './gateways/websocket.gateway';

// @Global()
// @Module({
//   providers: [WebSocketGateway],
//   exports: [WebSocketGateway],
// })
// export class SharedModule {}

import { Global, Module } from '@nestjs/common';
import { WebSocketGateway } from './gateways/websocket.gateway';
import { AuthModule } from './auth/auth.module';

@Global()
@Module({
  imports: [AuthModule], // Import AuthModule to resolve dependencies
  providers: [WebSocketGateway],
  exports: [WebSocketGateway],
})
export class SharedModule {}
