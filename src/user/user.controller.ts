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
  UseGuards,
  HttpStatus,
  BadRequestException,
  NotFoundException
} from "@nestjs/common/";
import { isMongoId } from "class-validator";

// types
import { UserDocument } from "./user.schema";
import { Request } from "express";
import { AuthGuard } from "../auth/auth.guard";

// decorators
import { Auth } from "../auth/auth.decorator";
import { User } from "./user.decorator";

// services
import { UserService } from "./user.service";
import { MaterialService } from "../materials/materials.service";
import { MaterialSchema, Material } from "../materials/materials.schema";
import { MaterialStatus } from '../materials/dto/create-materials.dto'

// DTOs
import { CreateUserDto, UpdateUserDto } from "./user.dto";
import { CreateMaterialDto } from "../materials/dto/create-materials.dto";

// utils
import { ValidateMongoId } from "../utils/validate-mongoId";

@Controller("users")
export class UserController {
  constructor(
    private userService: UserService,
    private readonly materialService: MaterialService
  ) {}

  @Auth()
  @Get("all-materials")
  async getAllMaterials(@Query() query: any) {
    return this.materialService.getAllMaterials(query);
  }

  @Auth()
  @Get("my-materials")
  async getUserMaterials(@Req() req: Request) {
	  console.log(req.user, 'uer Obj')
	// Ensure user is authenticated
	if (!req.user || !req.user._id) {
	  throw new HttpException("User not authenticated", HttpStatus.UNAUTHORIZED);
	}
  
	const userId = req.user._id; // Extract userId
  
	// Convert ObjectId to a string and validate
	const userIdString = typeof userId === 'string' ? userId : userId.toString();
  
	if (!isMongoId(userIdString)) {
	  throw new HttpException("Invalid user ID", HttpStatus.BAD_REQUEST);
	}
  
	// Fetch user materials
	return this.userService.getUserMaterials(userIdString);
  }
  @Auth()
  @Get("profile")
  async getUserProfile(@Req() req: Request) {
    console.log("User object:", req.user); // Debug the user object

    const userId = req.user?._id;

    if (!userId) {
      throw new HttpException(
        "User not authenticated",
        HttpStatus.UNAUTHORIZED
      );
    }

    // Convert ObjectId to a string and validate
    const userIdString = userId.toString();

    if (!isMongoId(userIdString)) {
      throw new HttpException("Invalid user ID", HttpStatus.BAD_REQUEST);
    }

    return this.userService.getUserProfile(userIdString);
  }


  @Auth()
  @Get("pending-materials")
  async getPendingMaterials(@Query() query: any) {
    return this.materialService.getPendingMaterials(query);
  }


  @Auth()
  @Get("approved-materials")
  async getApprovedMaterials(@Query() query: any) {
    return this.userService.getApprovedMaterials(query);
  }


  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Post()
  createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @Get("/:id")
  getUser(@Param("id", ValidateMongoId) id: string) {
    return this.userService.getUser(id);
  }
  @Auth()
  @Post("upload-material")
  async uploadMaterial(
    @Body() createMaterialDto: CreateMaterialDto,
    @Req() req: Request
  ) {
    const userId = req.user?.id; // Assuming user data is attached to the request
    if (!userId) {
      throw new Error("User is not authenticated");
    }
    const {
      name,
      description,
      fileUrl,
      academicLevel,
      semester,
      materialType,
    } = createMaterialDto;

    const material = await this.materialService.create(
      { name, description, fileUrl, academicLevel, semester, materialType },
      userId
    );
    return material;
  }

  @Auth()
  @Put("/:id")
  updateUser(
    @Param("id", ValidateMongoId) id: string,
    @Body() dto: UpdateUserDto,
    @User() user: UserDocument
  ) {
    return this.userService.updateUser(id, dto, user);
  }

  @Delete("/:id")
  @Auth()
  deleteUser(
    @Param("id", ValidateMongoId) id: string,
    @User() user: UserDocument
  ) {
    return this.userService.deleteUser(id, user);
  }

//   @Auth()
//  @Post("/approve")
//   async approveMaterial(
//   @Query("materialId") materialId: string,
//   @Query("userId") userId: string
// ) {
//   if (!materialId || !userId) {
//     throw new BadRequestException("Material ID and User ID are required");
//   }

//   const material = await this.materialService.approveMaterial(materialId, userId);
//   return material;
// }


// @Auth()
// @Post("/update-material-status")
//  async updateMaterialStatus(
//  @Query("materialId") materialId: string,
//  @Query("userId") userId: string,
//  @Query("status") status: string
// ) {
//  if (!materialId || !userId) {
//    throw new BadRequestException("Material ID and User ID are required");
//  }

//  if (!status) {
// 	throw new BadRequestException("Material Sttsus is required");
//   }

//  const material = await this.materialService.updateMaterialStatus(materialId, userId, status);
//  return material;
// }


@Auth()
@Post("/batch-approve")
async batchApproveMaterials(
  @Body() materials: { materialId: string; userId: string }[]
): Promise<{ message: string; results: { materialId: string; status: string; error?: string }[] }> {
  if (!materials || materials.length === 0) {
    throw new BadRequestException("No materials provided for batch approval");
  }

  const results = [];

  // A map to track points allocated per user
  const userPointsMap: Record<string, number> = {};

  for (const { materialId, userId } of materials) {
    try {
      // Fetch the material using MaterialService
      const material = await this.materialService.findById(materialId);

      if (!material) {
        results.push({
          materialId,
          status: "failed",
          error: `Material with ID ${materialId} not found`,
        });
        continue;
      }

      if (material.status === "approved") {
        results.push({
          materialId,
          status: "failed",
          error: `Material with ID ${materialId} is already approved`,
        });
        continue;
      }

      // Approve the material using MaterialService
      const approvedMaterial = await this.materialService.approveMaterialById(materialId);

      // Track points for the user
      if (!userPointsMap[userId]) {
        userPointsMap[userId] = 0;
      }
      userPointsMap[userId] += 10;

      results.push({
        materialId,
        status: "success",
      });
    } catch (error) {
      results.push({
        materialId,
        status: "failed",
        error: error.message,
      });
    }
  }

  // Allocate points to all users in the map
  for (const [userId, points] of Object.entries(userPointsMap)) {
    try {
      await this.userService.addPointsToUser(userId, points);
    } catch (error) {
      console.error(`Failed to allocate points to user ${userId}:`, error.message);
    }
  }

  return {
    message: "Batch approval process completed",
    results,
  };
}

@Auth()
@Post("/update-material-status")
async updateMaterialStatus(
	materialId: string,
	userId: string,
	status: MaterialStatus, // Use the enum here
	comment?: string, // Optional comment for rejected status
  ): Promise<{ message: string; material: Material }> {
	// Fetch the material using the service
	const material = await this.materialService.findMaterialById(materialId);
  
	// Check if the material already has the specified status
	if (material.status === status) {
	  return {
		message: `Material already has the status '${status}'`,
		material,
	  };
	}
  
	// Prepare the update payload
	const updatePayload: Partial<Material> = { status };
  
	// If the material is rejected, ensure a comment is provided
	if (status === MaterialStatus.REJECTED) {
	  if (!comment || comment.trim() === '') {
		throw new BadRequestException('A comment is required when rejecting a material');
	  }
	  updatePayload['comment'] = comment;
	}
  
	// Update the material using the service
	const updatedMaterial = await this.materialService.updateMaterialById(materialId, updatePayload);
  
	if (status === MaterialStatus.APPROVED) {
	  // Add points to the user only when the material is approved
	  await this.userService.addPointsToUser(userId, 10);
	}
  
	// Return success message and updated material
	return {
	  message: `Material status has been updated to '${status}' successfully`,
	  material: updatedMaterial,
	};
  }
}
