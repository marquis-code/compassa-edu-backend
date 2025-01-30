import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from "./auth.sevice";
import { AuthGuard } from "./auth.guard";
import { User, UserSchema } from '../user/user.schema';
import { WsJwtGuard } from './ws-jwt.guard';
import { GroupsModule } from '../group/group.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' }, // Adjust expiration if needed
    }),
    forwardRef(() => UserModule), // Use forwardRef here
    forwardRef(() => GroupsModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, WsJwtGuard],
  exports: [AuthService, AuthGuard, WsJwtGuard, JwtModule],
})
export class AuthModule {}