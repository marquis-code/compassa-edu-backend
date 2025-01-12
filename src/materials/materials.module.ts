import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MaterialService } from './materials.service';
import { MaterialsController } from './materials.controller';
import { Material, MaterialSchema } from './materials.schema';
import { UserModule } from '../user/user.module';
import { User, UserSchema } from '../user/user.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Material.name, schema: MaterialSchema },
      { name: User.name, schema: UserSchema }, // Add this line
    ]),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [MaterialsController],
  providers: [MaterialService],
  exports: [MaterialService],
})
export class MaterialsModule {}