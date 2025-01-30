// nest.js modules
import {
	Injectable,
	CanActivate,
	ExecutionContext,
	UnauthorizedException,
} from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"

// libraries
import { verify } from "jsonwebtoken"

// types
import { Request } from "express"
import { Model } from "mongoose"
import { User, UserDocument } from "../user/user.schema"

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private readonly User: Model<UserDocument>,
  ) {}

  async canActivate(ctx: ExecutionContext) {
    const request = ctx.switchToHttp().getRequest()

    // console.log('Request Headers:', request.headers);

    try {
      const token = this.getToken(request)
      // console.log('Extracted Token:', token)

      const decodedToken: any = verify(token, process.env.JWT_SECRET)
      // console.log('Decoded Token:', decodedToken)

      const user = await this.User.findById(decodedToken.id)
      // console.log('Found User:', user)

      if (!user)
        throw new UnauthorizedException([
          "User not found",
          "Please login again",
        ])

      request.user = user

      return true
    } catch (err) {
      console.error('Auth Guard Error:', err)
      throw new UnauthorizedException([
        "Login token expired",
        "Please login again"
      ])
    }
  }

  protected getToken(request: Request) {
    const authorization = request.headers.authorization

    // console.log('Authorization Header:', authorization)

    if (!(authorization && authorization.startsWith("Bearer")))
      throw new Error("Invalid Authorization Header")

    const token = authorization.split(" ")[1]

    return token
  }
}