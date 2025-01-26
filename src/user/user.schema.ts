import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { HydratedDocument } from "mongoose";
import { sign, SignOptions } from 'jsonwebtoken';
import { genSalt, hash, compare } from "bcryptjs";
import { randomBytes, createHash } from "crypto";

export type UserDocument = HydratedDocument<User> & {
  matchPassword: (password: string) => Promise<boolean>;
  getSignedJwtToken: () => string;
  getResetPasswordToken: () => string;
};

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

@Schema({ timestamps: true }) 
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, minlength: 6, select: false })
  password: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  matric: string;

  @Prop({ default: 0 })
  points?: number;

  @Prop()
  resetPasswordToken?: string;

  @Prop({ type: Date })
  resetPasswordExpire?: Date;

  @Prop([{ type: Types.ObjectId, ref: "Materials" }])
  uploadedMaterials?: Types.ObjectId[];


  @Prop({ type: [{ type: Types.ObjectId, ref: 'Group' }] })
  groups: Types.ObjectId[];

  
  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  createdAt?: Date;
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);


UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await compare(enteredPassword, this.password);
};

// UserSchema.methods.getSignedJwtToken = function () {
//   return sign({ id: this.id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRE,
//   });
// };

// UserSchema.methods.getSignedJwtToken = function () {
//   return sign(
//     { id: this.id }, 
//     process.env.JWT_SECRET as string, 
//     { 
//       expiresIn: process.env.JWT_EXPIRE as string 
//     }
//   );
// };

// UserSchema.methods.getSignedJwtToken = function () {
//   if (!process.env.JWT_SECRET) {
//     throw new Error('JWT_SECRET is not defined');
//   }
//   if (!process.env.JWT_EXPIRE) {
//     throw new Error('JWT_EXPIRE is not defined');
//   }

//   return sign(
//     { id: this.id }, 
//     process.env.JWT_SECRET, 
//     { expiresIn: process.env.JWT_EXPIRE }
//   );
// };

// import { sign } from 'jsonwebtoken';

// UserSchema.methods.getSignedJwtToken = function () {
//   const secret = process.env.JWT_SECRET;
//   const expiresIn = process.env.JWT_EXPIRE;

//   if (!secret) {
//     throw new Error('JWT_SECRET is not defined');
//   }
//   if (!expiresIn) {
//     throw new Error('JWT_EXPIRE is not defined');
//   }

//   return sign(
//     { id: this.id }, 
//     secret, 
//     { expiresIn }
//   );
// };

// import { sign, SignOptions } from 'jsonwebtoken';

// UserSchema.methods.getSignedJwtToken = function () {
//   const secret = process.env.JWT_SECRET;
//   const expiresIn = process.env.JWT_EXPIRE;

//   if (!secret) {
//     throw new Error('JWT_SECRET is not defined');
//   }
//   if (!expiresIn) {
//     throw new Error('JWT_EXPIRE is not defined');
//   }

//   const options: SignOptions = { expiresIn };

//   return sign({ id: this.id }, secret, options);
// };

UserSchema.methods.getSignedJwtToken = function () {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRE ? parseInt(process.env.JWT_EXPIRE, 10) : undefined;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }

  const options: SignOptions = { expiresIn };

  return sign({ id: this.id }, secret, options);
};

UserSchema.methods.getResetPasswordToken = function () {
  const token = randomBytes(20).toString("base64url");

  this.resetPasswordToken = createHash("sha256").update(token).digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return token;
};

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);

  next();
});
