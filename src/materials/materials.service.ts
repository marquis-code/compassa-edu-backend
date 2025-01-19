import { Injectable, NotFoundException, BadRequestException, ConflictException, forwardRef, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { Material, MaterialDocument } from './materials.schema';
// import { CreateMaterialDto, MaterialStatus } from './dto/create-materials.dto';
import { UpdateMaterialDto } from './dto/update-materials.dto';
import { UserService } from '../user/user.service';
import { Material, MaterialDocument, Category, CategoryDocument, Session, SessionDocument } from './materials.schema';
import { CreateMaterialDto, CreateCategoryDto, CreateSessionDto, MaterialStatus } from './dto/create-materials.dto';

@Injectable()
export class MaterialService {
  constructor(
    @InjectModel(Material.name) private materialModel: Model<MaterialDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) {
  }

  async create(
    createMaterialDto: CreateMaterialDto,
    userId: string,
  ): Promise<Material> {
    const createdMaterial = new this.materialModel({
      ...createMaterialDto,
      user: userId, // Associate the activity with the logged-in user
    });
 
    const savedMaterial = await createdMaterial.save();

    // Use user service to update the user's materials array
    await this.userService.addUploadedMaterial(userId, savedMaterial._id);

    return savedMaterial;
  }

  // async batchCreateMaterials(createMaterialsDto: CreateMaterialDto[], userId: string): Promise<Material[]> {
  //   const materials = createMaterialsDto.map(dto => ({
  //     ...dto,
  //     user: userId,
  //   }));

  //   return this.materialModel.insertMany(materials);
  // }

  async batchCreateMaterials(createMaterialsDto: CreateMaterialDto[], userId: string): Promise<Material[]> {
    const materials = createMaterialsDto.map(dto => ({
      ...dto,
      user: userId,
    }));
  
    // Use type assertion to explicitly cast the result of insertMany to Material[]
    return this.materialModel.insertMany(materials) as unknown as Material[];
  }

   // Category Logic
   async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = new this.categoryModel(createCategoryDto);
    return category.save();
  }

  async getCategories(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  async updateCategory(id: string, updateCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = await this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, { new: true });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async deleteCategory(id: string): Promise<void> {
    const result = await this.categoryModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }

    // Session Logic
    async createSession(createSessionDto: CreateSessionDto): Promise<Session> {
      const session = new this.sessionModel(createSessionDto);
      return session.save();
    }
  
    async getSessions(): Promise<Session[]> {
      return this.sessionModel.find().exec();
    }
  
    async updateSession(id: string, updateSessionDto: CreateSessionDto): Promise<Session> {
      const session = await this.sessionModel.findByIdAndUpdate(id, updateSessionDto, { new: true });
      if (!session) {
        throw new NotFoundException(`Session with ID ${id} not found`);
      }
      return session;
    }
  
    async deleteSession(id: string): Promise<void> {
      const result = await this.sessionModel.findByIdAndDelete(id);
      if (!result) {
        throw new NotFoundException(`Session with ID ${id} not found`);
      }
    }

  async findAll(query: any): Promise<Material[]> {
    const filters: any = { status: 'approved' };

    if (query.academicLevel) {
      filters.academicLevel = query.academicLevel;
    }

    if (query.semester) {
      filters.semester = query.semester;
    }

    if (query.materialType) {
      filters.materialType = query.materialType;
    }

    return this.materialModel.find(filters).exec();
  }

  async findOne(id: string, userId: string): Promise<Material> {
    const material = await this.materialModel
      .findOne({ _id: id, user: userId }) // Ensure the material belongs to the user
      .exec();
    if (!material) {
      throw new NotFoundException(`Material with ID ${id} not found`);
    }
    return material;
  }

  async update(
    id: string,
    updateMaterialDto: UpdateMaterialDto,
    userId: string,
  ): Promise<Material> {
    const updatedMaterial = await this.materialModel
      .findOneAndUpdate({ _id: id, user: userId }, updateMaterialDto, {
        new: true,
      })
      .exec();
    if (!updatedMaterial) {
      throw new NotFoundException(`Material with ID ${id} not found`);
    }
    return updatedMaterial;
  }

  async delete(id: string, userId: string): Promise<void> {
    const result = await this.materialModel
      .findOneAndDelete({ _id: id, user: userId })
      .exec();
    if (!result) {
      throw new NotFoundException(`Material with ID ${id} not found`);
    }
  }

  // async findByUserId(userId: string): Promise<Material[]> {
  //   return this.materialModel.find({ user: userId }).exec(); // Filter materials by user ID
  // }

  async findByUserId(userId: string): Promise<Material[]> {
    return this.materialModel
      .find({ user: userId }) // Filter materials by user ID
      .populate('session') // Populate the Session object
      .populate('category') // Populate the Category object
      .exec(); // Execute the query
  }

  async approveMaterial(materialId: string, userId: string, status: string): Promise<{ message: string; material: Material }> {
    // Fetch the material to check its current status
    const material = await this.materialModel.findById(materialId);
  
    if (!material) {
      throw new NotFoundException(`Material with ID ${materialId} not found`);
    }
  
    // Check if the material is already approved
    if (material.status === 'approved') {
      throw new ConflictException(`Material with ID ${materialId} has already been approved`);
    }
  
    // Update the material status to 'approved'
    const approvedMaterial = await this.materialModel.findByIdAndUpdate(
      materialId,
      { status: 'approved' },
      { new: true }, // Return the updated document
    );
  
    if (approvedMaterial) {
      // Add points to the user
      await this.userService.addPointsToUser(userId, 10);
    }
  
    // Return success message and updated material
    return {
      message: 'Material has been approved successfully',
      material: approvedMaterial,
    };
  }
  
  async getPendingMaterials(query: any): Promise<Material[]> {
    const filters: any = { status: 'pending' };

    if (query.academicLevel) {
      filters.academicLevel = query.academicLevel;
    }

    if (query.semester) {
      filters.semester = query.semester;
    }

    if (query.materialType) {
      filters.materialType = query.materialType;
    }

    return this.materialModel.find(filters).exec();
  }

  async getAllMaterials(query: any): Promise<Material[]> {
    const filters: any = {};
  
    if (query.academicLevel) {
      filters.academicLevel = query.academicLevel;
    }
  
    if (query.semester) {
      filters.semester = query.semester;
    }
  
    if (query.materialType) {
      filters.materialType = query.materialType;
    }
  
    if (query.status) {
      filters.status = query.status;
    }

    if (query.caategory) {
      filters.category = query.category;
    }

    if (query.session) {
      filters.session = query.session;
    }
  
    return this.materialModel.find(filters).populate('user', '-password -__v').exec();
  }

  

  async countMaterialsByUser(userId: string): Promise<number> {
    return this.materialModel.countDocuments({ user: userId });
  }

  // Find material by ID
  async findById(materialId: string): Promise<Material> {
    return this.materialModel.findById(materialId).exec();
  }

  // Find material by ID and update its status
  async approveMaterialById(materialId: string): Promise<Material> {
    return this.materialModel.findByIdAndUpdate(
      materialId,
      { status: 'approved' },
      { new: true }, // Return the updated document
    ).exec();
  }

  async findMaterialById(materialId: string): Promise<Material> {
    console.log('Got it from here', materialId)
    const material = await this.materialModel.findById(materialId);
    if (!material) {
      throw new NotFoundException(`Material with ID ${materialId} not found`);
    }
    return material;
  }
  
  async updateMaterialById(
    materialId: string,
    updatePayload: Partial<Material>,
  ): Promise<Material> {
    const updatedMaterial = await this.materialModel.findByIdAndUpdate(
      materialId,
      updatePayload,
      { new: true }, // Return the updated document
    );
    if (!updatedMaterial) {
      throw new NotFoundException(`Material with ID ${materialId} not found for update`);
    }
    return updatedMaterial;
  }


  async batchUpdateStatus(
    updates: { materialId: string; userId: string; status: MaterialStatus; comment?: string }[],
  ): Promise<{ success: number; failed: number; details: any[] }> {
    const results = await Promise.all(
      updates.map(async (update) => {
        try {
          const { materialId, userId, status, comment } = update;

          // Validate status
          if (!Object.values(MaterialStatus).includes(status)) {
            throw new BadRequestException(`Invalid status: ${status}`);
          }

          // Find material
          const material = await this.findMaterialById(materialId);

          // Skip if the status is already the same
          if (material.status === status) {
            return {
              materialId,
              status,
              message: `Material already has the status '${status}'`,
              success: true,
            };
          }

          // Prepare update payload
          const updatePayload: Partial<Material> = { status };
          if (status === MaterialStatus.REJECTED) {
            if (!comment) {
              throw new BadRequestException('A comment is required when rejecting a material');
            }
            updatePayload['comment'] = comment;
          }

          // Update material
          const updatedMaterial = await this.updateMaterialById(materialId, updatePayload);

          // Add points for approved materials
          if (status === MaterialStatus.APPROVED) {
            await this.userService.addPointsToUser(userId, 10);
          }

          return {
            materialId,
            status,
            message: `Material status updated to '${status}' successfully`,
            success: true,
          };
        } catch (error) {
          return {
            materialId: update.materialId,
            status: update.status,
            message: error.message || 'Failed to update material status',
            success: false,
          };
        }
      }),
    );

    // Summarize results
    const success = results.filter((result) => result.success).length;
    const failed = results.filter((result) => !result.success).length;

    return {
      success,
      failed,
      details: results,
    };
  }

  async findByCategoryId(categoryId: string) {
    return this.materialModel
      .find({ category: categoryId })
      .populate('session') // Optionally populate related fields
      .populate('category')
      .exec();
  }

  async findBySessionId(sessionId: string) {
    return this.materialModel
      .find({ session: sessionId })
      .populate('session') // Optionally populate related fields
      .populate('category')
      .exec();
  }


}
