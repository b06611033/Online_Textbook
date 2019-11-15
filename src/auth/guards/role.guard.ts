import { IncomingMessage } from "http";
import {
	Injectable,
	ExecutionContext,
	UnauthorizedException,
	CanActivate,
	BadRequestException
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Request } from "express";
import Role from "../role";
import User from "../../user/user.entity";

@Injectable()
export default class RoleGuard implements CanActivate {
	public constructor(private readonly reflector: Reflector) {}

	public canActivate(ctx: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request = ctx.switchToHttp().getRequest<IncomingMessage & Request>();
		const user = request.user as Partial<User>;

		const roles = this.reflector.get<Role[]>("roles", ctx.getHandler());

		if (user === undefined || user === null) {
			return false;
		}

		if (roles === undefined || roles.length === 0) {
			return false;
		}

		if (roles.includes(Role.ADMIN) && user.admin) {
			return true;
		}

		const params = request.params as { id?: string };
		const query: { userId?: string } = request.query;

		const paramId = parseInt(params.id!, 10);
		const queryId = parseInt(query.userId!, 10);

		if (isNaN(paramId) && isNaN(queryId)) {
			throw new BadRequestException("Check URL and query params");
		}

		if (roles.includes(Role.USER)) {
			if (paramId === user.id && isNaN(queryId)) {
				return true;
			} else if (queryId === user.id && isNaN(paramId)) {
				return true;
			} else if (paramId === user.id && queryId === user.id) {
				return true;
			}

			return false;
		}

		return false;
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
