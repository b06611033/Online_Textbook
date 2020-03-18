import { IncomingMessage } from "http";
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";
import JwtPayload from "../authentication/jwt-payload";

@Injectable()
export default class ProductGuard implements CanActivate {
	public constructor(
		private readonly reflector: Reflector,
		private readonly jwtService: JwtService
	) {}

	public async canActivate(ctx: ExecutionContext): Promise<boolean> {
		const req = ctx.switchToHttp().getRequest<IncomingMessage & Request>();
		const jwt = req.cookies.jwt as string | undefined;
		if (jwt === undefined) {
			throw new UnauthorizedException();
		}

		const jwtPayload = await this.jwtService.verifyAsync<JwtPayload>(jwt);

		return true;
	}
}
