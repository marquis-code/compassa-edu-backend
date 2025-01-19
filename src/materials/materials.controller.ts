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
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MaterialService } from '../materials/materials.service';
import { CreateMaterialDto, MaterialStatus } from './dto/create-materials.dto';
import { UpdateMaterialDto } from './dto/update-materials.dto';
import { CreateSessionDto } from './dto/create-session-dto'
import { CreateCategoryDto } from './dto/create-category-dto'

@Controller('materials')
@UseGuards(AuthGuard) // Ensure only authenticated users can access these routes
export class MaterialsController {
  constructor(private readonly materialService: MaterialService) {}

  @Post('upload-material')
  async uploadMaterial(@Body() createMaterialDto: CreateMaterialDto, @Req() req) {
    const userId = req.user?.id; // Assuming user data is attached to the request
    if (!userId) {
      throw new Error('User is not authenticated');
    }

    const material = await this.materialService.create(createMaterialDto, userId);
    return { success: true, data: material };
  }

  @Post('category')
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.materialService.createCategory(createCategoryDto);
    return { success: true, data: category };
  }

  @Get('categories')
  async getCategories() {
    const categories = await this.materialService.getCategories();
    return { success: true, data: categories };
  }

  @Put('category/:id')
  async updateCategory(@Param('id') id: string, @Body() updateCategoryDto: CreateCategoryDto) {
    const category = await this.materialService.updateCategory(id, updateCategoryDto);
    return { success: true, data: category };
  }

  @Delete('category/:id')
  async deleteCategory(@Param('id') id: string) {
    await this.materialService.deleteCategory(id);
    return { success: true, message: 'Category deleted successfully' };
  }


  @Post('session')
  async createSession(@Body() createSessionDto: CreateSessionDto) {
    const session = await this.materialService.createSession(createSessionDto);
    return { success: true, data: session };
  }

  @Get('sessions')
  async getSessions() {
    const sessions = await this.materialService.getSessions();
    return { success: true, data: sessions };
  }

  @Put('session/:id')
  async updateSession(@Param('id') id: string, @Body() updateSessionDto: CreateSessionDto) {
    const session = await this.materialService.updateSession(id, updateSessionDto);
    return { success: true, data: session };
  }

  @Delete('session/:id')
  async deleteSession(@Param('id') id: string) {
    await this.materialService.deleteSession(id);
    return { success: true, message: 'Session deleted successfully' };
  }

  // @Post('batch-upload-materials')
  // async batchUploadMaterials(@Body() createMaterialsDto: CreateMaterialDto[], @Req() req) {
  //   const userId = req.user?.id;
  //   if (!userId) {
  //     throw new Error('User is not authenticated');
  //   }

  //   const materials = await this.materialService.batchCreateMaterials(createMaterialsDto, userId);
  //   return { success: true, data: materials };
  // }

    // // Fixed batch-upload-materials implementation
    // @Post('batch-upload-materials')
    // async batchUploadMaterials(
    //   @Body() createMaterialsDto: CreateMaterialDto | CreateMaterialDto[], // Accepts both single object and array
    //   @Req() req
    // ) {
    //   const userId = req.user?.id; // Ensure user is authenticated
    //   if (!userId) {
    //     throw new Error('User is not authenticated');
    //   }
  
    //   // Ensure createMaterialsDto is processed as an array
    //   const materialsDtoArray = Array.isArray(createMaterialsDto) ? createMaterialsDto : [createMaterialsDto];
  
    //   // Call the service to handle material creation
    //   const materials = await this.materialService.batchCreateMaterials(materialsDtoArray, userId);
  
    //   // Return the response
    //   return { success: true, data: materials };
    // }


    @Post('batch-upload-materials')
async batchUploadMaterials(
  @Body() body: { materials: CreateMaterialDto[] }, // Expecting the materials wrapper
  @Req() req
) {
  const userId = req.user?.id; // Ensure user is authenticated
  if (!userId) {
    throw new Error('User is not authenticated');
  }

  // Validate and extract materials from the wrapper
  const materialsDtoArray = Array.isArray(body.materials) ? body.materials : [];

  // Call the service to handle material creation
  const materials = await this.materialService.batchCreateMaterials(materialsDtoArray, userId);

  // Return the response
  return { success: true, data: materials };
}

  

  @Get()
  async findAll(@Req() req) {
    try {
      const activities = await this.materialService.findAll(req.user.id);
      return { success: true, data: activities };
    } catch (error) {
      throw new HttpException(
        'Error fetching activities',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // @Get('user/:userId')
  // async findAllUserActivities(@Query('userId') userId: string, @Req() req) {
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

  @Get('user/:userId')
async findAllUserActivities(@Param('userId') userId: string, @Req() req) {
  try {
    // Check if userId is provided
    if (!userId) {
      throw new HttpException(
        'User ID is required to fetch activities',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Fetch all activities for the given user
    const activities = await this.materialService.findByUserId(userId);
    return { success: true, data: activities };
  } catch (error) {
    throw new HttpException(
      error.message || 'Error fetching activities',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}


  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    try {
      console.log(id, req.user.id, 'ids here')
      const material = await this.materialService.findOne(id, req.user.id);
      return { success: true, data: material };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error fetching material',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() UpdateMaterialDto: UpdateMaterialDto,
    @Req() req,
  ) {
    try {
      const updatedMaterial = await this.materialService.update(
        id,
        UpdateMaterialDto,
        req.user.id,
      );
      return { success: true, data: updatedMaterial };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error updating material',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req) {
    try {
      await this.materialService.delete(id, req.user.id);
      return { success: true, message: 'Material deleted successfully' };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error deleting material',
        HttpStatus.NOT_FOUND,
      );
    }
  }


  @Patch('batch-update-status')
  async batchUpdateMaterialStatus(
    @Body() updates: { materialId: string; userId: string; status: MaterialStatus; comment?: string }[],
  ): Promise<{ success: number; failed: number; details: any[] }> {
    return await this.materialService.batchUpdateStatus(updates);
  }
}
