
// groups/groups.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from './group.schema';
import { GroupsService } from './group.service';
import { GroupsController } from './groups.controller';
import { SharedModule } from '../shared.module';
// import { WebSocketGateway } from '../gateways/websocket.gateway';
import { AuthModule } from '../auth/auth.module'; // Import AuthModule,
import { UserModule } from '../user/user.module'; // Import UserModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }]),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule), // Add this
    forwardRef(() => SharedModule),
  ],
  controllers: [GroupsController],
  providers: [GroupsService],
  exports: [GroupsService, MongooseModule],
})
export class GroupsModule {}
