import {
	Controller,
	Post,
	Body,
	HttpCode,
	Get,
	Query,
	Req,
	Put,
  } from "@nestjs/common";
  import { Request } from "express";
  import { UserDocument } from "../user/user.schema";
  import { SignupDto, LoginDto, UpdatePasswordDto, ResetPasswordDto } from "./auth.dto";
  import { Auth } from "./auth.decorator";
  import { User } from "../user/user.decorator";
  import { AuthService } from "./auth.sevice";
  import { AuditService } from "../audit/audit.service";
  import { AuditAction } from "../audit/audit.schema";
  import { Types } from "mongoose";
  
  @Controller("auth")
  export class AuthController {
	constructor(
	  private authService: AuthService,
	  private auditService: AuditService // Inject AuditService
	) {}


	@Post("signup")
async signup(@Body() dto: SignupDto, @Req() req: Request) {
  const result = await this.authService.signup(dto); // Get the signup response
  const user = (result as any).user ?? result; // Extract the user object safely

  if (!user || !user._id) {
    throw new Error("User ID (_id) not found in signup response");
  }

  const userId = user._id.toString(); // Ensure _id is a string

  // Log signup action
  await this.auditService.logAudit(
    AuditAction.CREATE,
    "User",
    userId, // Use string representation of _id
    user, // Pass full user object
    null, // No changes
    req.ip,
    req.headers["user-agent"],
    { email: dto.email } // ✅ Metadata is correctly passed
  );

  return user;
}

@Post("login")
@HttpCode(200)
async login(@Body() dto: LoginDto, @Req() req: Request) {
  const { token, user } = await this.authService.login(dto); // Extract user

  // Ensure user._id is a string
  const userId = user._id.toString(); 

  // Log login action
  await this.auditService.logAudit(
    AuditAction.ACCESS,
    "User",
    userId, // Use string representation of _id
    user, // Pass full user object
    null, // No changes
    req.ip,
    req.headers["user-agent"],
    { matric: dto.matric } // ✅ Metadata is correctly passed
  );

  return { token, user };
}

  
// @Post("signup")
// async signup(@Body() dto: SignupDto, @Req() req: Request) {
//   const result = await this.authService.signup(dto); // Get the signup response
//   const user = (result as any).user ?? result; // Extract the user object safely

//   if (!user || !user._id) {
//     throw new Error("User ID (_id) not found in signup response");
//   }

//   const userId = user._id.toString(); // Ensure _id is a string

//   // Log signup action
//   await this.auditService.logAudit(
//     AuditAction.CREATE,
//     "User",
//     userId, // Use string representation of _id
//     user._id, // Pass _id directly (it's already an ObjectId)
//     null,
//     req.ip,
//     req.headers["user-agent"],
//     { email: dto.email }
//   );

//   return user;
// }


// 	@Post("login")
// @HttpCode(200)
// async login(@Body() dto: LoginDto, @Req() req: Request) {
//   const { token, user } = await this.authService.login(dto); // Extract user

//   // Ensure user._id is a string
//   const userId = user._id.toString(); 

//   // Log login action
//   await this.auditService.logAudit(
//     AuditAction.ACCESS,
//     "User",
//     userId, // Use string representation of _id
//     user._id, // Pass _id directly (it's already ObjectId)
//     null,
//     req.ip,
//     req.headers["user-agent"],
//     { email: dto.matric }
//   );

//   return { token, user };
// }

  
	@Auth()
	@Get("profile")
	getCurrentUser(@User() user: UserDocument) {
	  return { user };
	}
  
	@Auth()
	@Put("update-password")
	async updatePassword(@Body() dto: UpdatePasswordDto, @User() user: UserDocument, @Req() req: Request) {
	  await this.authService.updatePassword(dto, user);
  
	  // Log password update action
	  await this.auditService.logAudit(
		AuditAction.UPDATE,
		"User",
		user.id,
		new Types.ObjectId(user.id),
		{ passwordChanged: true },
		req.ip,
		req.headers["user-agent"]
	  );
  
	  return { message: "Password updated successfully" };
	}
  
	@Auth()
	@Post("forgot-password")
	async forgotPassword(@Req() req: Request, @Query("email") email: string) {
	  await this.authService.forgotPassword(req, email);
  
	  // Log forgot password request
	  await this.auditService.logAudit(
		AuditAction.ACCESS,
		"User",
		null, // No specific document affected
		null, // No user authenticated
		{ email },
		req.ip,
		req.headers["user-agent"]
	  );
  
	  return { message: "Password reset link sent to your email" };
	}
  
	@Put("reset-password")
	async resetPassword(
	  @Body() dto: ResetPasswordDto,
	  @Query("token") token: string,
	  @Req() req: Request
	) {
	  const { user } = await this.authService.resetPassword(dto, token); // Extract user
	  const userId = user._id.toString(); // Ensure user._id is converted to string
	
	  // Log password reset action
	  await this.auditService.logAudit(
		AuditAction.UPDATE,
		"User",
		userId, // Use string representation of _id
		user._id, // Pass _id directly, it's already an ObjectId
		{ passwordReset: true },
		req.ip,
		req.headers["user-agent"]
	  );
	
	  return { message: "Password reset successfully" };
	}
	
  }
  