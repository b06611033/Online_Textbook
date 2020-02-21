import { Injectable, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { Observable } from "rxjs";
import AuthProvider from "../auth.provider";
import type User from "../../user/user.entity";

@Injectable()
export default class GoogleAuthGuard extends AuthGuard(AuthProvider.GOOGLE) {
	public canActivate(ctx: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		this.logIn(ctx.switchToHttp().getRequest());

		return super.canActivate(ctx);
	}

	// eslint-disable-next-line class-methods-use-this
	public handleRequest<U extends Partial<User>>(err: Error, user: U, info?: string): U {
		if (err !== undefined && err !== null) {
			throw err;
		}

		if (user === undefined) {
			throw new UnauthorizedException();
		}

		return user;
	}
}
