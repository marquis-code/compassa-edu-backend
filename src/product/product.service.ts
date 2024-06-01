import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from 'mongoose'; 
import { Product, ProductDocument } from "./product.schema";
import { Review, ReviewDocument } from "../review/review.schema";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { ProductDto, UpdateProductDto } from "./product.dto";
import { User, UserDocument } from '../user/user.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly Product: Model<ProductDocument>,

    @InjectModel(Review.name)
    private readonly Review: Model<ReviewDocument>,
	  private readonly cloudinary: CloudinaryService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async getProducts() {
    const products = await this.Product.find();

    return { products };
  }

  async getProduct(id: string) {
    const product = await this.Product.findById(id).populate("reviews");

    if (!product)
      throw new NotFoundException(["No product found with the entered ID"]);

    return { product };
  }

  async createProduct(dto: ProductDto, user: any, file: any) {
	const cloudinaryResponse = await this.cloudinary.uploadImage(file)
	const productPayload = {
		...dto,
		createdBy: user._id,
    cloudinary_id: cloudinaryResponse.public_id,
    image: cloudinaryResponse.url
	}
    const product = await this.Product.create(productPayload);
    return { product };
  }
  
  async updateProduct(id: string, dto: UpdateProductDto, userId: string, file?: any) {
    let updateData = { ...dto };

    if (file) {
      const product = await this.Product.findById(id);

      if (!product)
        throw new NotFoundException(["No product found with the entered ID"]);

      if (product.createdBy.toString() !== userId) {
        throw new ForbiddenException('You can only edit your own products');
      }

      // Delete old image from Cloudinary
      if (product.cloudinary_id) {
        await this.cloudinary.deleteImage(product.cloudinary_id);
      }

      // Upload new image to Cloudinary
      const cloudinaryResponse = await this.cloudinary.uploadImage(file);
      updateData = {
        ...updateData,
        cloudinary_id: cloudinaryResponse.public_id,
        image: cloudinaryResponse.url
      };
    }

    const updatedProduct = await this.Product.findByIdAndUpdate(id, updateData, {
      runValidators: true,
      new: true,
    });

    if (!updatedProduct)
      throw new NotFoundException(["No product found with the entered ID"]);

    return { product: updatedProduct };
  }

  async deleteProduct(id: string, userId: string) {
    const product = await this.Product.findByIdAndDelete(id);

    if (!product)
      throw new NotFoundException(["No product found with the entered ID"]);

    const user = await this.userModel.findById(userId);
    if (!user || (user.role !== 'vendor' && user.role !== 'admin')) {
      throw new ForbiddenException('Only vendors and admins can delete products');
    }
    if (user.role === 'vendor' && product.createdBy.toString() !== userId) {
      throw new ForbiddenException('Vendors can only delete their own products');
    }

    // Delete product image from Cloudinary
    if (product.cloudinary_id) {
      await this.cloudinary.deleteImage(product.cloudinary_id);
    }

    await this.Review.deleteMany({ product: product._id });

    return {};
  }

  async getVendorProducts(vendorId: string): Promise<Product[]> {
    const objectId = new Types.ObjectId(vendorId);
    return this.Product.find({ createdBy: objectId }).exec();
  }

}
