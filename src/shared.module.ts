// // import { Global, Module } from '@nestjs/common';
// // import { WebSocketGateway } from './gateways/websocket.gateway';

// // @Global()
// // @Module({
// //   providers: [WebSocketGateway],
// //   exports: [WebSocketGateway],
// // })
// // export class SharedModule {}

// import { Global, Module, forwardRef } from '@nestjs/common';
// import { WebSocketGateway } from './gateways/websocket.gateway';
// import { AuthModule } from './auth/auth.module';
// import { GroupsService } from './group/group.service';
// import { GroupsModule } from './group/group.module';

// @Global()
// @Module({
//   imports: [forwardRef(() => AuthModule), forwardRef(() => GroupsModule)], // Import AuthModule to resolve dependencies
//   providers: [
//     WebSocketGateway, GroupsService, GroupsModule
//   ],
//   exports: [WebSocketGateway, GroupsService, GroupsModule
//   ],
// })
// export class SharedModule {}

import { Global, Module, forwardRef } from '@nestjs/common';
import { WebSocketGateway } from './gateways/websocket.gateway';
import { AuthModule } from './auth/auth.module';
import { GroupsService } from './group/group.service';
import { GroupsModule } from './group/group.module';
import { MessagesModule } from './message/messages.module';

@Global()
@Module({
  imports: [
    forwardRef(() => AuthModule), 
    forwardRef(() => GroupsModule),
    forwardRef(() => MessagesModule)
  ], // Import AuthModule and GroupsModule
  providers: [WebSocketGateway], // Only include providers directly managed by SharedModule
  exports: [WebSocketGateway], // Export only what's needed for other modules
})
export class SharedModule {}
