import { Module, forwardRef } from "@nestjs/common"

import { ImageController } from "./image.controller"

import { UserModule } from "src/user/user.module"

@Module({
	imports: [forwardRef(() => UserModule)],
	controllers: [ImageController],
})
export class ImageModule {}
