import { IncomingMessage } from "http";
import { Injectable, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { Request } from "express";
import AuthProvider from "../auth.provider";
import User from "../../user/user.entity";

@Injectable()
export default class JwtAuthGuard extends AuthGuard(AuthProvider.JWT) {
	public canActivate(ctx: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		this.logIn(ctx.switchToHttp().getRequest<IncomingMessage & Request>());

		return super.canActivate(ctx);
	}

	// eslint-disable-next-line class-methods-use-this
	public handleRequest<U extends User>(err: Error, user: U, info?: string): U {
		if (err !== undefined && err !== null) {
			throw err;
		}

		if (user === undefined) {
			throw new UnauthorizedException();
		}

		return user;
	}
}
