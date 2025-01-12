// nest.js modules
import {
	Controller,
	Get,
	Post,
	Put,
	Delete,
	Body,
	Param,
	Query,
	Req,
	HttpException,
	HttpStatus
} from "@nestjs/common/"

// types
import { UserDocument } from "./user.schema"
import { Request } from 'express';

// decorators
import { Auth } from "../auth/auth.decorator"
import { User } from "./user.decorator"

// services
import { UserService } from "./user.service"
import { MaterialService } from "../materials/materials.service"

// DTOs
import { CreateUserDto, UpdateUserDto } from "./user.dto"

// utils
import { ValidateMongoId } from "../utils/validate-mongoId"

@Controller("users")
export class UserController {
	constructor(
		private userService: UserService,
	    private readonly materialService: MaterialService
	) {}

	@Get()
	// @Auth(Role.Admin)
	getUsers() {
		return this.userService.getUsers()
	}

	@Post()
	// @Auth(Role.Admin)
	createUser(@Body() dto: CreateUserDto) {
		return this.userService.createUser(dto)
	}

	@Get("/:id")
	getUser(@Param("id", ValidateMongoId) id: string) {
		return this.userService.getUser(id)
	}

	@Put("/:id")
	@Auth()
	updateUser(
		@Param("id", ValidateMongoId) id: string,
		@Body() dto: UpdateUserDto,
		@User() user: UserDocument,
	) {
		return this.userService.updateUser(id, dto, user)
	}

	@Delete("/:id")
	@Auth()
	deleteUser(
		@Param("id", ValidateMongoId) id: string,
		@User() user: UserDocument,
	) {
		return this.userService.deleteUser(id, user)
	}

	@Auth()
	@Post('/approve/:materialId/:userId')
	async approveMaterial(
	  @Param('materialId') materialId: string,
	  @Param('userId') userId: string
	) {
	  const material = await this.materialService.approveMaterial(materialId, userId);
	  return material;
	}
	
  
	@Auth()
	@Get('pending-materials')
	async getPendingMaterials(@Query() query: any) {
	  return this.materialService.getPendingMaterials(query);
	}
  
	@Auth()
	@Get('all-materials')
	async getAllMaterials(@Query() query: any) {
	  return this.materialService.getAllMaterials(query);
	}

	@Auth()
	@Get('approved-materials')
	async getApprovedMaterials(@Query() query: any) {
	  return this.userService.getApprovedMaterials(query);
	}
  
	// @Auth()
	// @Get('my-materials')
	// async getUserMaterials(@Req() req: Request) {
	//   return this.userService.getUserMaterials(req.user?.userId);
	// }

	@Auth()
	@Get('my-materials')
	async getUserMaterials(@Req() req: Request) {
	if (!req.user?.userId) {
		throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
	}
  return this.userService.getUserMaterials(req.user.userId);
}
  
	@Auth()
	@Get('profile')
	async getUserProfile(@Req() req: Request) {
	  return this.userService.getUserProfile(req.user?.userId);
	}
}
