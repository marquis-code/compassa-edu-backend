import { Injectable, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Material, MaterialDocument } from './materials.schema';
import { CreateMaterialDto } from './dto/create-materials.dto';
import { UpdateMaterialDto } from './dto/update-materials.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class MaterialService {
  constructor(
    @InjectModel(Material.name) private materialModel: Model<MaterialDocument>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) {}

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

  async findAll(userId: string): Promise<Material[]> {
    return this.materialModel.find({ user: userId }).exec(); // Filter materials by user
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

  async findByUserId(userId: string): Promise<Material[]> {
    return this.materialModel.find({ user: userId }).exec(); // Filter materials by user ID
  }

  async approveMaterial(materialId: string, userId: string): Promise<Material> {
    const approvedMaterial = await this.materialModel.findByIdAndUpdate(
      materialId,
      { status: 'approved' },
      { new: true },
    );

    if (approvedMaterial) {
      // Use user service to add points to the user
      await this.userService.addPointsToUser(userId, 10);
    }

    return approvedMaterial;
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

    return this.materialModel.find(filters).exec();
  }


  async countMaterialsByUser(userId: string): Promise<number> {
    return this.materialModel.countDocuments({ user: userId });
  }
}
