// nest.js modules
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
  forwardRef,
  Inject
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Semester, MaterialType, AcademicLevel } from '../materials/dto/create-materials.dto'
import { MaterialStatus } from '../materials/dto/create-materials.dto'

// types
import { Model } from "mongoose";

// schema
import { User, UserDocument } from "./user.schema";

// DTOs
import { CreateUserDto, UpdateUserDto } from "./user.dto";
import { Material} from "../materials/materials.schema";
import { MaterialService } from "../materials/materials.service";


@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly User: Model<UserDocument>,
    @Inject(forwardRef(() => MaterialService))
    private readonly materialService: MaterialService,
    // @InjectModel(User.name) private readonly User: Model<UserDocument>,
    // private readonly materialService: MaterialService
    // @InjectModel(Material.name) private readonly materialModel: Model<MaterialDocument>
  ) {}

  async getUsers() {
    const users = await this.User.find();

    return { users };
  }

  async createUser(createUserDto: CreateUserDto): Promise<{ user: User }> {
    // Check if a user already exists with the provided email
    let existingUser = await this.User.findOne({ email: createUserDto.email });
  
    if (existingUser) {
      throw new ConflictException(["A user already exists with the entered email"]);
    }
  
    const currentDate = new Date();
  
    const user = new this.User({
      ...createUserDto,
      uploadedMaterials: createUserDto.uploadedMaterials || []
    });
  
    const savedUser = await user.save();
  
    if (savedUser) {
      savedUser.password = undefined; // Remove password before returning the user
    }
  
    return { user: savedUser };
  }

  // async getUser(id: string) {
  //   console.log(id, 'user id here')
  //   const user = await this.User.findById(id).exec();
  //   console.log(user)
  
  //   if (!user) {
  //     throw new NotFoundException(["No user found with the entered ID"]);
  //   }
  
  //   return user; // Return the user directly
  // }

  async getUser(id: string) {
    console.log(id, 'user id here');
    const user = await this.User.findById(id)
      .populate('uploadedMaterials') // Populate the uploadedMaterials field with related documents
      .exec();
    console.log(user);
  
    if (!user) {
      throw new NotFoundException(["No user found with the entered ID"]);
    }
  
    return user; // Return the user object with populated materials
  }

  async updateUser(id: string, dto: UpdateUserDto, currentUser: UserDocument) {
    const user = await this.User.findById(id);

    if (!user)
      throw new NotFoundException(["No user found with the entered ID"]);

    if (currentUser.id !== user.id)
      throw new ForbiddenException([
        "The current user can't access this resource",
      ]);

    user.name = dto.name;
    user.phone = dto.phone;

    await user.save();

    return { user };
  }

  async deleteUser(id: string, currentUser: UserDocument) {
    const user = await this.User.findById(id);

    if (!user)
      throw new NotFoundException(["No user found with the entered ID"]);

    if (currentUser.id !== user.id)
      throw new ForbiddenException([
        "The current user can't access this resource",
      ]);

    await user.deleteOne();

    return {};
  }

  // async uploadMaterial(
  //   userId: string,
  //   name: string,
  //   description: string,
  //   fileUrl: string,
  //   academicLevel: string,
  //   semester: string,
  //   materialType: string,
  // ) {
  //   const material = await this.materialService.create(
  //     { name, description, fileUrl, academicLevel, semester, materialType },
  //     userId,
  //   );
  //   return material;
  // }

// async uploadMaterial(
//   userId: string,
//   name: string,
//   description: string,
//   fileUrl: string,
//   academicLevel: string,
//   semester: string,
//   materialType: string,
// ) {
//   // Validate and cast semester to the Semester enum
//   if (!Object.values(Semester).includes(semester as Semester)) {
//     throw new Error(`Invalid semester: ${semester}. Valid options are: ${Object.values(Semester).join(', ')}`);
//   }

//   // Validate and cast materialType to the MaterialType enum
//   if (!Object.values(MaterialType).includes(materialType as MaterialType)) {
//     throw new Error(`Invalid material type: ${materialType}. Valid options are: ${Object.values(MaterialType).join(', ')}`);
//   }

//   const material = await this.materialService.create(
//     { 
//       name, 
//       description, 
//       fileUrls, 
//       academicLevel: academicLevel as AcademicLevel, 
//       semester: semester as Semester, // Cast to Semester enum
//       materialType: materialType as MaterialType, // Cast to MaterialType enum
//     },
//     userId,
//   );
//   return material;
// }

async uploadMaterial(
  userId: string,
  name: string,
  description: string,
  fileUrl: string,
  academicLevel: string,
  semester: string,
  materialType: string,
  category: string,    // Added missing required field
  session: string,     // Added missing required field
) {
  // Convert single fileUrl to fileUrls array
  const fileUrls = [fileUrl];

  // Validate and cast semester to the Semester enum
  if (!Object.values(Semester).includes(semester as Semester)) {
    throw new Error(`Invalid semester: ${semester}. Valid options are: ${Object.values(Semester).join(', ')}`);
  }

  // Validate and cast materialType to the MaterialType enum
  if (!Object.values(MaterialType).includes(materialType as MaterialType)) {
    throw new Error(`Invalid material type: ${materialType}. Valid options are: ${Object.values(MaterialType).join(', ')}`);
  }

  // Validate and cast academicLevel to the AcademicLevel enum
  if (!Object.values(AcademicLevel).includes(academicLevel as AcademicLevel)) {
    throw new Error(`Invalid academic level: ${academicLevel}. Valid options are: ${Object.values(AcademicLevel).join(', ')}`);
  }

  const material = await this.materialService.create(
    { 
      name, 
      description, 
      fileUrls,        // Changed from fileUrl to fileUrls array
      academicLevel: academicLevel as AcademicLevel, 
      semester: semester as Semester,
      materialType: materialType as MaterialType,
      category,        // Added missing required field
      session,         // Added missing required field
      status: MaterialStatus.PENDING  // Added default status
    },
    userId,
  );
  return material;
}


  async getApprovedMaterials(query: any): Promise<Material[]> {
    return this.materialService.findAll(query)
  }


  async addPointsToUser(userId: string, points: number): Promise<void> {
    await this.User.findByIdAndUpdate(userId, { $inc: { points } });
  }

  async addUploadedMaterial(userId: string, materialId: string): Promise<void> {
    await this.User.findByIdAndUpdate(userId, {
      $push: { uploadedMaterials: materialId },
    });
  }

  
  async getUserMaterials(userId: string): Promise<Material[]> {
    console.log("Looking for user with ID:", userId);
    return this.materialService.findByUserId(userId)
    // return this.materialModel.find({ user: userId }).exec();
  }

  async getUserProfile(userId: string): Promise<any> {
    console.log("Looking for user with ID:", userId);
    const user = await this.User.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Fetch materials uploaded count from materialService
    const materialsUploaded = await this.materialService.countMaterialsByUser(userId);

    // Return user profile details
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      materialsUploaded,
      points: user.points,
    };
  }

}
