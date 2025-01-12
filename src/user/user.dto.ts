import {
	IsEmail,
	IsMobilePhone,
	IsString,
	MinLength,
	IsOptional,
	IsArray,
	IsMongoId,
	IsEnum
} from "class-validator";

export enum UserRole {
	ADMIN = "admin",
	USER = "user",
}



export class CreateUserDto {
	@IsString({
		message: "Enter a name",
	})
	name: string;

	@IsEmail({}, { message: "Enter a valid email" })
	email: string;

	@MinLength(6, { message: "Enter a password at least 6 characters long" })
	password: string;

	@IsMobilePhone(null, {}, { message: "Enter a valid phone number" })
	phone: string;

	@IsMobilePhone(null, {}, { message: "Enter a valid matric number" })
	matric: string;

	@IsMobilePhone(null, {}, { message: "Enter a valid matric number" })
	points?: number;

	@IsOptional()
	@IsArray({ message: "Uploads must be an array" })
	@IsMongoId({ each: true, message: "Each upload must be a valid MongoDB ID" })
	uploadedMaterials?: string[]; // Optional array of MongoDB IDs


	@IsOptional()
	@IsEnum(UserRole, { message: "Enter a valid role: admin or user" })
	role?: UserRole;
}

export class UpdateUserDto {
	@IsOptional()
	@IsString({
		message: "Enter a name",
	})
	name?: string;

	@IsOptional()
	@IsEmail({}, { message: "Enter a valid email" })
	email?: string;

	@IsOptional()
	@MinLength(6, { message: "Enter a password at least 6 characters long" })
	password?: string;

	@IsOptional()
	@IsMobilePhone(null, {}, { message: "Enter a valid phone number" })
	phone?: string;

	@IsOptional()
	@IsMobilePhone(null, {}, { message: "Enter a valid matric number" })
	matric?: string;

	@IsOptional()
	@IsArray({ message: "Uploads must be an array" })
	@IsMongoId({ each: true, message: "Each upload must be a valid MongoDB ID" })
	uploads?: string[]; // Optional array of MongoDB IDs

	@IsOptional()
	@IsEnum(UserRole, { message: "Enter a valid role: admin or user" })
	role?: UserRole;
}
