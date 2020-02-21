import type { IncomingMessage, ServerResponse } from "http";
import { Controller, Logger, UseGuards, Get, Req, Res } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import type { Response, Request } from "express";
import type { JwtService } from "@nestjs/jwt";
import type User from "../user/user.entity";
import type EnvConfigService from "../server-config/env-config.service";
import AuthProvider from "./auth.provider";
import Role from "./role";
import Roles from "./role.decorator";
import RoleGuard from "./guards/role.guard";
import type JwtPayload from "./jwt-payload";

@ApiTags("auth")
@Controller("auth")
export default class AuthController {
	private static readonly logger = new Logger(AuthController.name);

	public constructor(
		private readonly jwtService: JwtService,
		private readonly envConfigService: EnvConfigService
	) {}

	@Get("google/login")
	@UseGuards(AuthGuard(AuthProvider.GOOGLE))
	// eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-empty-function
	public googleLogin(): void {}

	@Get("google/callback")
	@UseGuards(AuthGuard(AuthProvider.GOOGLE))
	public googleLoginCallback(
		@Req() req: IncomingMessage & Request,
		@Res() res: ServerResponse & Response
	): void {
		res.cookie("jwt", this.jwtService.sign({ sub: (req.user as User).id } as JwtPayload));
		res.redirect(this.envConfigService.mymaStoreDomain);
	}

	@Get("jwt/login")
	@ApiBearerAuth()
	@UseGuards(AuthGuard(AuthProvider.JWT))
	// eslint-disable-next-line class-methods-use-this
	public jwtLogin(@Req() req: IncomingMessage & Request): User {
		return req.user as User;
	}

	@Get("jwt/admin")
	@ApiBearerAuth()
	@Roles(Role.ADMIN)
	@UseGuards(AuthGuard(AuthProvider.JWT), RoleGuard)
	// eslint-disable-next-line class-methods-use-this
	public jwtAuthenticated(@Req() req: IncomingMessage & Request): string {
		return `${(req.user as User).name}`;
	}
}
