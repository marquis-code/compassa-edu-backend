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

@Controller('materials')
@UseGuards(AuthGuard) // Ensure only authenticated users can access these routes
export class MaterialsController {
  constructor(private readonly materialService: MaterialService) {}

  @Post()
  async create(@Body() createMaterialDto: CreateMaterialDto, @Req() req) {
    try {
      const material = await this.materialService.create(
        createMaterialDto,
        req.user.id, // Logged-in user's ID
      );
      return { success: true, data: material };
    } catch (error) {
      throw new HttpException(
        'Error creating meterial',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
