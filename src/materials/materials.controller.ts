import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
  Put,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
  Patch
} from '@nestjs/common';
import { AuthGuard } from "../auth/auth.guard"
import { Document, Types } from 'mongoose';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MaterialService } from '../materials/materials.service';
import { CreateMaterialDto, MaterialStatus } from './dto/create-materials.dto';
import { MaterialDocument } from '../materials/materials.schema'
import { UpdateMaterialDto } from './dto/update-materials.dto';
import { CreateSessionDto } from './dto/create-session-dto'
import { CreateCategoryDto } from './dto/create-category-dto'
import { AuditService } from '../audit/audit.service';
import { AuditAction } from '../audit/audit.schema';
import { UserDocument } from '../user/user.schema';

@Controller('materials')
@UseGuards(AuthGuard) // Ensure only authenticated users can access these routes
export class MaterialsController {
  constructor(private readonly materialService: MaterialService,
    private readonly auditService: AuditService, // Inject AuditService
  ) {}

  @Post('upload-material')
async uploadMaterial(@Body() createMaterialDto: CreateMaterialDto, @Req() req) {
  const user = req.user as UserDocument;
  const userId = req.user?.id; // Ensuring user is authenticated

  if (!userId) {
    throw new Error('User is not authenticated');
  }

  // Create material first
  const material = await this.materialService.create(createMaterialDto, userId);

  // Correctly cast `material` AFTER creation
  const materialDoc = material as MaterialDocument;

  // Log upload action with full user details
  await this.auditService.logAudit(
    AuditAction.CREATE,
    "Material",
    materialDoc._id.toString(), // Now TypeScript recognizes `_id`
    user, // Pass full user object
    { title: material.name },
    req.ip,
    req.headers["user-agent"]
  );

  return { success: true, data: material };
}

// @Post('category')
// async createCategory(@Body() createCategoryDto: CreateCategoryDto, @Req() req) {
//   const user = req.user as UserDocument;
  
//   const category = await this.materialService.createCategory(createCategoryDto);
//   const categoryId = category._id.toString();

//   // Log category creation
//   await this.auditService.logAudit(
//     AuditAction.CREATE,
//     "Category",
//     categoryId,
//     user, // Pass full user object
//     { name: category.name },
//     req.ip,
//     req.headers["user-agent"]
//   );

//   return { success: true, data: category };
// }

@Post('category')
async createCategory(@Body() createCategoryDto: CreateCategoryDto, @Req() req) {
  const user = req.user as UserDocument;
  
  const category = await this.materialService.createCategory(createCategoryDto);
  const categoryDoc = category as unknown as { _id: Types.ObjectId }; // Cast to fix `_id` error
  const categoryId = categoryDoc._id.toString(); // Convert `_id` to string

  await this.auditService.logAudit(
    AuditAction.CREATE,
    "Category",
    categoryId,
    user,
    { name: category.name },
    req.ip,
    req.headers["user-agent"]
  );

  return { success: true, data: category };
}

@Get('categories')
async getCategories(@Req() req) {
  const user = req.user as UserDocument;
  
  const categories = await this.materialService.getCategories();

  // Log category retrieval action
  await this.auditService.logAudit(
    AuditAction.ACCESS,
    "Category",
    null, // No specific document affected
    user,
    null,
    req.ip,
    req.headers["user-agent"]
  );

  return { success: true, data: categories };
}

@Put('category/:id')
async updateCategory(@Param('id') id: string, @Body() updateCategoryDto: CreateCategoryDto, @Req() req) {
  const user = req.user as UserDocument;

  const category = await this.materialService.updateCategory(id, updateCategoryDto);

  // Log category update action
  await this.auditService.logAudit(
    AuditAction.UPDATE,
    "Category",
    id,
    user,
    { updatedFields: updateCategoryDto },
    req.ip,
    req.headers["user-agent"]
  );

  return { success: true, data: category };
}

@Delete('category/:id')
async deleteCategory(@Param('id') id: string, @Req() req) {
  const user = req.user as UserDocument;

  await this.materialService.deleteCategory(id);

  // Log category deletion action
  await this.auditService.logAudit(
    AuditAction.DELETE,
    "Category",
    id,
    user,
    null,
    req.ip,
    req.headers["user-agent"]
  );

  return { success: true, message: 'Category deleted successfully' };
}

// @Post('session')
// async createSession(@Body() createSessionDto: CreateSessionDto, @Req() req) {
//   const user = req.user as UserDocument;

//   const session = await this.materialService.createSession(createSessionDto);
//   const sessionId = session._id.toString();

//   // Log session creation
//   await this.auditService.logAudit(
//     AuditAction.CREATE,
//     "Session",
//     sessionId,
//     user,
//     { name: session.name },
//     req.ip,
//     req.headers["user-agent"]
//   );

//   return { success: true, data: session };
// }

@Post('session')
async createSession(@Body() createSessionDto: CreateSessionDto, @Req() req) {
  const user = req.user as UserDocument;

  const session = await this.materialService.createSession(createSessionDto);
  const sessionDoc = session as unknown as { _id: Types.ObjectId }; // Fix `_id` error
  const sessionId = sessionDoc._id.toString(); // Convert `_id` to string

  await this.auditService.logAudit(
    AuditAction.CREATE,
    "Session",
    sessionId,
    user,
    { name: session.name },
    req.ip,
    req.headers["user-agent"]
  );

  return { success: true, data: session };
}

@Get('sessions')
async getSessions(@Req() req) {
  const user = req.user as UserDocument;

  const sessions = await this.materialService.getSessions();

  // Log session retrieval action
  await this.auditService.logAudit(
    AuditAction.ACCESS,
    "Session",
    null, // No specific document affected
    user,
    null,
    req.ip,
    req.headers["user-agent"]
  );

  return { success: true, data: sessions };
}

//   @Put('session/:id')
//   async updateSession(@Param('id') id: string, @Body() updateSessionDto: CreateSessionDto) {
//     const session = await this.materialService.updateSession(id, updateSessionDto);
//     return { success: true, data: session };
//   }

//   @Delete('session/:id')
//   async deleteSession(@Param('id') id: string) {
//     await this.materialService.deleteSession(id);
//     return { success: true, message: 'Session deleted successfully' };
//   }

//     @Post('batch-upload-materials')
// async batchUploadMaterials(
//   @Body() body: { materials: CreateMaterialDto[] }, // Expecting the materials wrapper
//   @Req() req
// ) {
//   const userId = req.user?.id; // Ensure user is authenticated
//   if (!userId) {
//     throw new Error('User is not authenticated');
//   }

//   // Validate and extract materials from the wrapper
//   const materialsDtoArray = Array.isArray(body.materials) ? body.materials : [];

//   // Call the service to handle material creation
//   const materials = await this.materialService.batchCreateMaterials(materialsDtoArray, userId);

//   // Return the response
//   return { success: true, data: materials };
// }

  

//   @Get()
//   async findAll(@Req() req) {
//     try {
//       const activities = await this.materialService.findAll(req.user.id);
//       return { success: true, data: activities };
//     } catch (error) {
//       throw new HttpException(
//         'Error fetching activities',
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }

//   @Get('user/:userId')
// async findAllUserActivities(@Param('userId') userId: string, @Req() req) {
//   try {
//     // Check if userId is provided
//     if (!userId) {
//       throw new HttpException(
//         'User ID is required to fetch activities',
//         HttpStatus.BAD_REQUEST,
//       );
//     }

//     // Fetch all activities for the given user
//     const activities = await this.materialService.findByUserId(userId);
//     return { success: true, data: activities };
//   } catch (error) {
//     throw new HttpException(
//       error.message || 'Error fetching activities',
//       HttpStatus.INTERNAL_SERVER_ERROR,
//     );
//   }
// }


//   @Get(':id')
//   async findOne(@Param('id') id: string, @Req() req) {
//     try {
//       console.log(id, req.user.id, 'ids here')
//       const material = await this.materialService.findOne(id, req.user.id);
//       return { success: true, data: material };
//     } catch (error) {
//       throw new HttpException(
//         error.message || 'Error fetching material',
//         HttpStatus.NOT_FOUND,
//       );
//     }
//   }

//   @Put(':id')
//   async update(
//     @Param('id') id: string,
//     @Body() UpdateMaterialDto: UpdateMaterialDto,
//     @Req() req,
//   ) {
//     try {
//       const updatedMaterial = await this.materialService.update(
//         id,
//         UpdateMaterialDto,
//         req.user.id,
//       );
//       return { success: true, data: updatedMaterial };
//     } catch (error) {
//       throw new HttpException(
//         error.message || 'Error updating material',
//         HttpStatus.NOT_FOUND,
//       );
//     }
//   }

//   @Delete(':id')
//   async delete(@Param('id') id: string, @Req() req) {
//     try {
//       await this.materialService.delete(id, req.user.id);
//       return { success: true, message: 'Material deleted successfully' };
//     } catch (error) {
//       throw new HttpException(
//         error.message || 'Error deleting material',
//         HttpStatus.NOT_FOUND,
//       );
//     }
//   }

//   @Get('by-category/:categoryId')
//   async getMaterialsByCategory(@Param('categoryId') categoryId: string) {
//     try {
//       const materials = await this.materialService.findByCategoryId(categoryId);
//       return { success: true, data: materials };
//     } catch (error) {
//       throw new HttpException(
//         error.message || 'Error fetching materials by category',
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }

//   @Get('by-session/:sessionId')
//   async getMaterialsBySession(@Param('sessionId') sessionId: string) {
//     try {
//       const materials = await this.materialService.findBySessionId(sessionId);
//       return { success: true, data: materials };
//     } catch (error) {
//       throw new HttpException(
//         error.message || 'Error fetching materials by session',
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }


//   @Patch('batch-update-status')
//   async batchUpdateMaterialStatus(
//     @Body() updates: { materialId: string; userId: string; status: MaterialStatus; comment?: string }[],
//   ): Promise<{ success: number; failed: number; details: any[] }> {
//     return await this.materialService.batchUpdateStatus(updates);
//   }
@Put('session/:id')
  async updateSession(@Param('id') id: string, @Body() updateSessionDto: CreateSessionDto, @Req() req) {
    const user = req.user as UserDocument;
    const session = await this.materialService.updateSession(id, updateSessionDto);

    await this.auditService.logAudit(
      AuditAction.UPDATE,
      "Session",
      id,
      user,
      { updatedFields: updateSessionDto },
      req.ip,
      req.headers["user-agent"]
    );

    return { success: true, data: session };
  }

  @Delete('session/:id')
  async deleteSession(@Param('id') id: string, @Req() req) {
    const user = req.user as UserDocument;
    await this.materialService.deleteSession(id);

    await this.auditService.logAudit(
      AuditAction.DELETE,
      "Session",
      id,
      user,
      null,
      req.ip,
      req.headers["user-agent"]
    );

    return { success: true, message: 'Session deleted successfully' };
  }

  // @Post('batch-upload-materials')
  // async batchUploadMaterials(@Body() body: { materials: CreateMaterialDto[] }, @Req() req) {
  //   const user = req.user as UserDocument;
  //   const userId = user._id;

  //   if (!userId) {
  //     throw new Error('User is not authenticated');
  //   }

  //   const materialsDtoArray = Array.isArray(body.materials) ? body.materials : [];
  //   const materials = await this.materialService.batchCreateMaterials(materialsDtoArray, userId);

  //   await this.auditService.logAudit(
  //     AuditAction.CREATE,
  //     "Material",
  //     null, // No single document affected
  //     user,
  //     { batchUploaded: materials.length },
  //     req.ip,
  //     req.headers["user-agent"]
  //   );

  //   return { success: true, data: materials };
  // }

  @Post('batch-upload-materials')
async batchUploadMaterials(@Body() body: { materials: CreateMaterialDto[] }, @Req() req) {
  const user = req.user as UserDocument;
  const userId = user._id.toString(); // Fix ObjectId error

  if (!userId) {
    throw new Error('User is not authenticated');
  }

  const materialsDtoArray = Array.isArray(body.materials) ? body.materials : [];
  const materials = await this.materialService.batchCreateMaterials(materialsDtoArray, userId);

  await this.auditService.logAudit(
    AuditAction.CREATE,
    "Material",
    null,
    user,
    { batchUploaded: materials.length },
    req.ip,
    req.headers["user-agent"]
  );

  return { success: true, data: materials };
}

  @Get()
  async findAll(@Req() req) {
    try {
      const user = req.user as UserDocument;
      const activities = await this.materialService.findAll(user._id);

      await this.auditService.logAudit(
        AuditAction.ACCESS,
        "Material",
        null,
        user,
        null,
        req.ip,
        req.headers["user-agent"]
      );

      return { success: true, data: activities };
    } catch (error) {
      throw new HttpException('Error fetching activities', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('user/:userId')
  async findAllUserActivities(@Param('userId') userId: string, @Req() req) {
    try {
      if (!userId) {
        throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
      }

      const user = req.user as UserDocument;
      const activities = await this.materialService.findByUserId(userId);

      await this.auditService.logAudit(
        AuditAction.ACCESS,
        "Material",
        null,
        user,
        { accessedUserId: userId },
        req.ip,
        req.headers["user-agent"]
      );

      return { success: true, data: activities };
    } catch (error) {
      throw new HttpException(error.message || 'Error fetching activities', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    const user = req.user as UserDocument;
    const userId = user._id.toString(); // Fix ObjectId error
    try {
      const user = req.user as UserDocument;
      const material = await this.materialService.findOne(id, userId);
      

      await this.auditService.logAudit(
        AuditAction.ACCESS,
        "Material",
        id,
        user,
        null,
        req.ip,
        req.headers["user-agent"]
      );

      return { success: true, data: material };
    } catch (error) {
      throw new HttpException(error.message || 'Error fetching material', HttpStatus.NOT_FOUND);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateMaterialDto: UpdateMaterialDto, @Req() req) {
    const user = req.user as UserDocument;
    const userId = user._id.toString(); // Fix ObjectId error
    try {
      const user = req.user as UserDocument;
      const updatedMaterial = await this.materialService.update(id, updateMaterialDto, userId);

      await this.auditService.logAudit(
        AuditAction.UPDATE,
        "Material",
        id,
        user,
        { updatedFields: updateMaterialDto },
        req.ip,
        req.headers["user-agent"]
      );

      return { success: true, data: updatedMaterial };
    } catch (error) {
      throw new HttpException(error.message || 'Error updating material', HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req) {
    const user = req.user as UserDocument;
    const userId = user._id.toString(); // Fix ObjectId error
    try {
      const user = req.user as UserDocument;
      await this.materialService.delete(id, userId);

      await this.auditService.logAudit(
        AuditAction.DELETE,
        "Material",
        id,
        user,
        null,
        req.ip,
        req.headers["user-agent"]
      );

      return { success: true, message: 'Material deleted successfully' };
    } catch (error) {
      throw new HttpException(error.message || 'Error deleting material', HttpStatus.NOT_FOUND);
    }
  }

  @Get('by-category/:categoryId')
  async getMaterialsByCategory(@Param('categoryId') categoryId: string, @Req() req) {
    try {
      const user = req.user as UserDocument;
      const materials = await this.materialService.findByCategoryId(categoryId);

      await this.auditService.logAudit(
        AuditAction.ACCESS,
        "Material",
        null,
        user,
        { categoryId },
        req.ip,
        req.headers["user-agent"]
      );

      return { success: true, data: materials };
    } catch (error) {
      throw new HttpException(error.message || 'Error fetching materials by category', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('by-session/:sessionId')
  async getMaterialsBySession(@Param('sessionId') sessionId: string, @Req() req) {
    try {
      const user = req.user as UserDocument;
      const materials = await this.materialService.findBySessionId(sessionId);

      await this.auditService.logAudit(
        AuditAction.ACCESS,
        "Material",
        null,
        user,
        { sessionId },
        req.ip,
        req.headers["user-agent"]
      );

      return { success: true, data: materials };
    } catch (error) {
      throw new HttpException(error.message || 'Error fetching materials by session', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch('batch-update-status')
  async batchUpdateMaterialStatus(@Body() updates: { materialId: string; userId: string; status: MaterialStatus; comment?: string }[], @Req() req) {
    const user = req.user as UserDocument;
    const response = await this.materialService.batchUpdateStatus(updates);

    await this.auditService.logAudit(
      AuditAction.UPDATE,
      "Material",
      null,
      user,
      { batchUpdated: updates.length },
      req.ip,
      req.headers["user-agent"]
    );

    return response;
  }
}
