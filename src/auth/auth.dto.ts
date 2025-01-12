import {
	IsString,
	IsNotEmpty,
	IsEmail,
	IsMobilePhone,
	MinLength,
	IsEnum,
	IsArray,
	ArrayMinSize,
	IsDate,
	IsOptional
  } from 'class-validator';

  import { SubscriptionPlan } from "../shared/enums";
  
  
  export class SignupDto {
	@IsString({ message: 'Enter your full name' })
	name: string;
  
	@IsEmail({}, { message: 'Enter a valid email address' })
	email: string;
  
	@IsMobilePhone(null, {}, { message: 'Enter a valid phone number' })
	phone: string;

	@IsString({ message: 'Enter your matric number' })
	matric: string;
  
	@IsString()
	@MinLength(6, { message: 'Enter a password at least 6 characters long' })
	password: string;
  }
  

export class LoginDto {
	@IsString({ message: 'Enter your matric number' })
	matric: string

	@IsNotEmpty({ message: "Enter a password" })
	password: string
}

export class UpdatePasswordDto {
	@IsNotEmpty({ message: "Enter current password" })
	password: string

	@MinLength(6, { message: "Enter new password atleast 6 characters long" })
	newPassword: string
}

export class ResetPasswordDto {
	@MinLength(6, { message: "Enter a password atleast 6 characters long" })
	password: string
}
